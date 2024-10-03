from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum
from django.db.models.functions import Coalesce

# Restframework

from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView, \
    RetrieveUpdateDestroyAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime

# Others
import json
import random

# Custom Imports
from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, ProfileSerializer, CategorySerializer, \
    PostSerializer, AuthorSerializer, CommentSerializer, UserSerializer, NotificationSerializer
from api.models import Post, Profile, Comment, Category, Notification, Bookmark

User = get_user_model()


# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class ProfileView(RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        return profile


def generate_numeric_otp(length=7):
    # Generate a random 7-digit OTP
    otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
    return otp


class PasswordEmailVerify(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_object(self, *args, **kwargs):
        email = self.kwargs['email']
        user = User.objects.get(email=email)

        if user:
            user.otp = generate_numeric_otp()
            uidb64 = user.pk

            # Generate a token and include it in the reset link sent via email
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store the reset_token in the user model for later verification
            user.reset_token = reset_token
            user.save()

            link = f"http://localhost:5173/create-new-password?otp={user.otp}&uidb64={uidb64}&reset_token={reset_token}"

            merge_data = {
                'link': link,
                'username': user.username,
            }
            subject = f"Password Reset Request"
            text_body = render_to_string("email/password_reset.txt", merge_data)
            html_body = render_to_string("email/password_reset.html", merge_data)

            msg = EmailMultiAlternatives(
                subject=subject, from_email=settings.FROM_EMAIL,
                to=[user.email], body=text_body
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send()
        return user


class PasswordChangeView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()

            return Response({"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "An Error Occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


######################## Post APIs ########################

class CategoryListAPIView(ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.all()


# class PostViewSet(viewsets.ModelViewSet):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
# 
#     def perform_create(self, serializer):
#         # Automatically associate the logged-in user's profile with the post
#         serializer.save(profile=self.request.user.profile)

class PostCategoryListAPIView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = Category.objects.get(slug=category_slug)
        posts = Post.objects.filter(category=category, status="Active")
        return posts


class PostListAPIView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Post.objects.filter(status="Active").order_by("-view")


class PostDetailAPIView(RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        post = Post.objects.get(slug=slug, status="Active")
        post.view = post.view + 1
        post.save()
        return post


class LikePostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = User.objects.get(id=user_id)
        post = Post.objects.get(id=post_id)

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            Notification.objects.create(
                user=post.user,
                post=post,
                type="Like"
            )
            return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)


class PostCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        post_id = request.data["post_id"]
        user_id = request.data["user_id"]
        comment = request.data["comment"]

        post = Post.objects.get(id=post_id)
        user= User.objects.get(id=user_id)

        Comment.objects.create(
            post=post,
            name=user.full_name,
            email=user.email,
            comment=comment,
        )

        Notification.objects.create(
            user=post.user,
            post=post,
            type="Comment"
        )

        return Response({"message": "Comment Sent"}, status=status.HTTP_201_CREATED)


class BookmarkPostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = User.objects.get(id=user_id)
        post = Post.objects.get(id=post_id)

        bookmark = Bookmark.objects.filter(post=post, user=user).first()

        if bookmark:
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        else:
            Bookmark.objects.create(
                user=user,
                post=post,
            )
            Notification.objects.create(
                user=post.user,
                post=post,
                type="Bookmark"
            )
            return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)


######################## Author Dashboard APIs ########################


class DashboardStats(ListAPIView):
    serializer_class = AuthorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)

        views = Post.objects.filter(user=user).aggregate(view=Coalesce(Sum("view"), 0))["view"]
        posts = Post.objects.filter(user=user).count()
        likes = Post.objects.filter(likes=user).count()
        bookmarks = Bookmark.objects.filter(user=user).count()

        return [{
            "views": views,
            "posts": posts,
            "likes": likes,
            "bookmarks": bookmarks,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DashboardPostLists(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)

        return Post.objects.filter(user=user).order_by("-id")


class DashboardCommentLists(ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)

        return Comment.objects.filter(post__user=user)


class DashboardNotificationList(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)

        return Notification.objects.filter(user=user, seen=False)


class DashboardMarkNotificationAsSeen(ListAPIView):

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        noti_id = request.data["noti_id"]
        noti = Notification.objects.get(id=noti_id)

        noti.seen = True
        noti.save()

        return Response({"message": "Notifications marked as seen"}, status=status.HTTP_200_OK)


class DashboardReplyCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'reply': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        comment_id = request.data["comment_id"]
        reply = request.data["reply"]

        comment = Comment.objects.get(id=comment_id)
        comment.reply = reply
        comment.save()

        return Response({"message": "Your Response was sent"}, status=status.HTTP_201_CREATED)


class DashboardPostCreateAPIView(CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def create(self, request,*args, **kwargs):
        user_id = request.data.get("user_id")
        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        tags = request.data.get("tags")
        category_id = request.data.get("category")
        post_status = request.data.get("post_status")
        print(f"Profile_id: {user_id}")

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(id=user_id)
        category = Category.objects.get(id=category_id)

        Post.objects.create(
            user=user,
            title=title,
            profile=profile,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status,
        )

        return Response({"message": "Post Created successfully"}, status=status.HTTP_201_CREATED)


class DashboardPostEditAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        post_id = self.kwargs["post_id"]
        user = User.objects.get(id=user_id)

        return Post.objects.get(id=post_id, user=user)

    def update(self, request, *args, **kwargs):
        post_instance = self.get_object()

        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        tags = request.data.get("tags")
        category_id = request.data.get("category")
        post_status = request.data.get("post_status")

        category = Category.objects.get(id=category_id)

        post_instance.title = title
        if image != "undefined":
            post_instance.image = image
        post_instance.description = description
        post_instance.tags = tags
        post_instance.category = category
        post_instance.status = post_status

        post_instance.save()
        return Response({"message": "Post Updated successfully"}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        post_instance = self.get_object()
        post_instance.delete()

        return Response({"message": "Post Deleted successfully"}, status=status.HTTP_200_OK)


