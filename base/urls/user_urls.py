from django.urls import path

from base.views.user_views import (
    deleteUser,
    getUserById,
    getUserProfile,
    getUsers,
    registerUser,
    updateUser,
    updateUserProfile,
)

urlpatterns = [
    path("register/", registerUser, name="register"),
    path("profile/", getUserProfile, name="user-profile"),
    path("profile/update/", updateUserProfile, name="user-profile-update"),
    path("", getUsers, name="users"),
    path("<str:pk>/", getUserById, name="user"),
    path("<str:pk>/update/", updateUser, name="user-update"),
    path("<str:pk>/delete/", deleteUser, name="user-delete"),
]
