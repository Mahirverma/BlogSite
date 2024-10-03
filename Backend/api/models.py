from django.db.models import Model,CharField,EmailField,TextField,FileField,OneToOneField,BooleanField,DateTimeField,CASCADE,SlugField,ForeignKey,IntegerField,ManyToManyField
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils.html import mark_safe
from django.utils.text import slugify
import shortuuid

# Create your models here.

class User(AbstractUser):
    username=CharField(unique=True,max_length=100)
    email=EmailField(unique=True)
    full_name=CharField(max_length=100,null=True,blank=True)
    otp = CharField(max_length=100, null=True, blank=True)
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        email_username,mobile=self.email.split("@")
        if self.full_name =="" or self.full_name==None:
            self.full_name=email_username
        if self.username=="" or self.username==None:
            self.username=email_username

        super(User,self).save(*args,**kwargs)

class Profile(Model):
    user=OneToOneField(User,on_delete=CASCADE)
    image=FileField(upload_to="image",default="default.jpg",null=True,blank=True)
    full_name=CharField(max_length=100,null=True,blank=True)
    bio = CharField(max_length=250,null=True, blank=True)
    about=TextField(null=True,blank=True)
    author=BooleanField(default=False)
    country=CharField(max_length=250,null=True,blank=True)
    facebook=CharField(max_length=250,null=True,blank=True)
    twitter=CharField(max_length=250,null=True,blank=True)
    date=DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)

    def save(self, *args, **kwargs):
        if self.full_name =="" or self.full_name==None:
            self.full_name=self.user.full_name

        super(Profile,self).save(*args,**kwargs)

    def thumbnail(self):
        return mark_safe('<img src="/media/%s" width="50" height="50" object-fit:"cover" style="border-radius: 30px; object-fit: cover;" />' % (self.image))

def create_user_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender,instance,**kwargs):
    instance.profile.save()

post_save.connect(create_user_profile,sender=User)
post_save.connect(save_user_profile,sender=User)


class Category(Model):
    title=CharField(max_length=100)
    image=FileField(upload_to="image",null=True,blank=True)
    slug=SlugField(unique=True,null=True,blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural="Category"

    def save(self,*args,**kwargs):
        if self.slug=="" or self.slug==None:
            self.slug=slugify(self.title)
        super(Category,self).save(*args,**kwargs)

    def post_count(self):
        return Post.objects.filter(category=self).count()

class Post(Model):
    
    STATUS=(
        ("Active","Active"),
        ("Draft","Draft"),
        ("Disabled","Disabled"),
    )

    user=ForeignKey(User, on_delete=CASCADE)
    profile=ForeignKey(Profile,on_delete=CASCADE,null=True,blank=True)
    category=ForeignKey(Category,on_delete=CASCADE,null=True,blank=True)
    title=CharField(max_length=100)
    tags=CharField(max_length=100,null=True,blank=True)
    description=TextField(null=True,blank=True)
    image=FileField(upload_to="image",null=True,blank=True)
    status=CharField(choices=STATUS,max_length=100,default="Active")
    view=IntegerField(default=0)
    likes=ManyToManyField(User,blank=True,related_name="likes_user")
    slug=SlugField(unique=True,null=True,blank=True)
    date=DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering=["-date"]
        verbose_name_plural="Post"

    def save(self,*args,**kwargs):
        if self.slug=="" or self.slug==None:
            self.slug=slugify(self.title) + "-" + shortuuid.uuid()[:2]
        super(Post,self).save(*args,**kwargs)

    def comments(self):
        return Comment.objects.filter(post=self).order_by("-date")

class Comment(Model):
    post=ForeignKey(Post,on_delete=CASCADE)
    name=CharField(max_length=100)
    email=CharField(max_length=100)
    comment=TextField()
    date=DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post.title} - {self.name}"

    class Meta:
        ordering=["-date"]
        verbose_name_plural="Comment"

class Bookmark(Model):
    user=ForeignKey(User, on_delete=CASCADE)
    post=ForeignKey(Post,on_delete=CASCADE)
    date=DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post.title} - {self.user.username}"

    class Meta:
        ordering=["-date"]
        verbose_name_plural="Bookmark"

class Notification(Model):
    NOTI_TYPE=(
        ("Like","Like"),
        ("Comment","Comment"),
        ("Bookmark","Bookmark"),
    )

    user=ForeignKey(User, on_delete=CASCADE)
    post=ForeignKey(Post,on_delete=CASCADE)
    type=CharField(choices=NOTI_TYPE, max_length=100)
    seen=BooleanField(default=False)
    date=DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.post:
            return f"{self.post.title}-{self.type}"
        else:
            return "Notification"

    class Meta:
        ordering=["-date"]
        verbose_name_plural="Notification"