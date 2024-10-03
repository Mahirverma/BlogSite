from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from api.views import MyTokenObtainPairView,RegisterView,ProfileView,CategoryListAPIView,PostCategoryListAPIView,PostListAPIView,PostDetailAPIView,LikePostAPIView,PostCommentAPIView,BookmarkPostAPIView,DashboardStats,DashboardPostLists,DashboardCommentLists,DashboardNotificationList,DashboardMarkNotificationAsSeen,DashboardReplyCommentAPIView,DashboardPostCreateAPIView,DashboardPostEditAPIView, PasswordEmailVerify, PasswordChangeView

urlpatterns=[
    # Userauths API Endpoints
    path('user/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('user/token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/',RegisterView.as_view(), name='auth_register'),
    path('user/profile/<user_id>/',ProfileView.as_view(), name='user_profile'),
    path('user/password-reset/<email>/', PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', PasswordChangeView.as_view(), name='password_reset'),

    # Post Endpoints
    path('post/category/list/',CategoryListAPIView.as_view()),
    path('post/category/posts/<category_slug>/',PostCategoryListAPIView.as_view()),
    path('post/lists/',PostListAPIView.as_view()),
    path('post/detail/<slug>/',PostDetailAPIView.as_view()),
    path('post/like-post/',LikePostAPIView.as_view()),
    path('post/comment-post/',PostCommentAPIView.as_view()),
    path('post/bookmark-post/',BookmarkPostAPIView.as_view()),

    # Dashboard APIs Endpoints
    path('author/dashboard/stats/<user_id>/',DashboardStats.as_view()),
    path('author/dashboard/post-list/<user_id>/', DashboardPostLists.as_view()),
    path('author/dashboard/comment-list/<user_id>/',DashboardCommentLists.as_view()),
    path('author/dashboard/noti-list/<user_id>/',DashboardNotificationList.as_view()),
    path('author/dashboard/noti-mark-seen/',DashboardMarkNotificationAsSeen.as_view()),
    path('author/dashboard/reply-comment/',DashboardReplyCommentAPIView.as_view()),
    path('author/dashboard/post-create/',DashboardPostCreateAPIView.as_view()),
    path('author/dashboard/post-detail/<user_id>/<post_id>/',DashboardPostEditAPIView.as_view()),
    path ('author/dashboard/destroy/<user_id>/<post_id>/', DashboardPostEditAPIView.as_view()),
]
