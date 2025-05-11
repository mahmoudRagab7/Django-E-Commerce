from django.urls import path

from base.views.product_views import (
    createProduct,
    createProductReview,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
    uploadImage,
)

urlpatterns = [
    path("", getProducts, name="products"),
    path("<str:pk>/", getProduct, name="product"),
    path("<str:pk>/delete/", deleteProduct, name="product-delete"),
    path("create/", createProduct, name="product-create"),
    path("<str:pk>/update/", updateProduct, name="product-update"),
    path("upload/", uploadImage, name="upload-image"),
    path("<str:pk>/reviews/", createProductReview, name="create-review"),
]
