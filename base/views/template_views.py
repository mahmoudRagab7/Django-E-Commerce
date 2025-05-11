from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def register(request):
    return render(request, "register.html")


def login(request):
    return render(request, "login.html")


def products(request):
    return render(request, "products.html")


def product_detail(request, pk):
    return render(request, "product_detail.html")


def cart(request):
    return render(request, "cart.html")


def profile(request):
    return render(request, "profile.html")


def orders(request):
    return render(request, "orders.html")
