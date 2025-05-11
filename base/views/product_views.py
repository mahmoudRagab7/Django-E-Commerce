from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from ..models import Product, Review
from ..serializers import ProductSerializer, ReviewSerializer


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("keyword", "")
    products = Product.objects.filter(name__icontains=query)
    page = request.query_params.get("page", 1)
    paginator = Paginator(products, 10)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    serializer = ProductSerializer(products, many=True)
    return Response(
        {"products": serializer.data, "page": page, "pages": paginator.num_pages}
    )


@api_view(["GET"])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({"detail": "Product deleted successfully"})
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name="Sample Name",
        price=0,
        brand="Sample Brand",
        countInStock=0,
        category="Sample Category",
        description="",
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        data = request.data
        product.name = data.get("name", product.name)
        product.price = data.get("price", product.price)
        product.brand = data.get("brand", product.brand)
        product.countInStock = data.get("countInStock", product.countInStock)
        product.category = data.get("category", product.category)
        product.description = data.get("description", product.description)
        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
def uploadImage(request):
    data = request.data
    product_id = data["product_id"]
    try:
        product = Product.objects.get(_id=product_id)
        product.image = request.FILES.get("image")
        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    try:
        product = Product.objects.get(_id=pk)
        data = request.data
        if product.review_set.filter(user=user).exists():
            return Response(
                {"detail": "Product already reviewed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        rating = data["rating"]
        comment = data["comment"]
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=rating,
            comment=comment,
        )
        reviews = product.review_set.all()
        product.numReviews = reviews.count()
        total = sum(review.rating for review in reviews)
        product.rating = total / reviews.count()
        product.save()
        return Response({"detail": "Review added"})
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
        )
