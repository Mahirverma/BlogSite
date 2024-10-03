from django.contrib import admin
from django.contrib.auth import get_user_model
from api.models import Profile,Category,Post,Comment,Bookmark,Notification

# Register your models here.
User=get_user_model()
class UserAdmin(admin.ModelAdmin):
    search_fields  = ['full_name', 'username', 'email']
    list_display  = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    search_fields  = ['user']
    list_display = ['thumbnail', 'user', 'full_name']

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title"]
    prepopulated_fields = {'slug': ['title']}

class PostAdmin(admin.ModelAdmin):
    list_display = ["title","user","category","view"]
    prepopulated_fields = {'slug': ['title']}

class CommentAdmin(admin.ModelAdmin):
    list_display = ["post","name","email","comment"]

class BookmarkAdmin(admin.ModelAdmin):
    list_display = ["user","post"]

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user","post","type","seen",]


admin.site.register(User,UserAdmin)
admin.site.register(Profile,ProfileAdmin)
admin.site.register(Category,CategoryAdmin)
admin.site.register(Post,PostAdmin)
admin.site.register(Comment,CommentAdmin)
admin.site.register(Bookmark,BookmarkAdmin)
admin.site.register(Notification,NotificationAdmin)
