from django.urls import path
from . import views

app_name = 'community'

urlpatterns = [
    path('', views.article_list_or_create, name="article_list_or_create"),
    path('<int:article_pk>/', views.article_detail_or_update_or_delete, name="article_detail_or_update_or_delete"),
    path('<int:article_pk>/like/', views.like_article, name="like_article"),
    path('<int:article_pk>/comments/', views.create_comment, name="create_comment"),
    path('<int:article_pk>/comments/<int:comment_pk>/', views.comment_update_or_delete, name="comment_update_or_delete"),
    # path('<str:article_title>/', views.),   # search
    # path('announce/', views.),
    # path('hottopic/', views.),
    # path('article_list/', views.),
    path('<int:article_pk>/views/', views.record_view),
]
