var Image = window.Image,
    $ = window.$,
    Navbar = $(".navbar"),
    Menu = $(".navbar-menu"),
    Body = $("html, body"),
    FootTop = $(".footer-top"),
    NavList = $(".navbar-list"),
    LoadImg = $("load-img");
Menu.on("click", function() { return Navbar.toggleClass("navbar-focus", window.scrollY < 50), NavList.toggleClass("navbar-list-show") }), FootTop.on("click", function() { Body.animate({ scrollTop: 0 }, 500) }), $(window).scroll(function() { console.log("Cool"), Navbar.toggleClass("navbar-focus", 50 < window.scrollY) }), LoadImg.each(function(o, a) { var t = new Image,
        n = a.getAttribute("src"),
        e = a.getAttribute("alt"),
        r = a.getAttribute("class");
    t.onload = function() { var o = $(t);
        o.attr("alt", e), o.attr("class", r), a.before(o.get(0)), $(a).remove() }, t.onerror = function(o) { console.log("One of the images didn't load " + o) }, t.src = n }), $(document).ready(function() { $("a[href^='/']").click(function() { $("div.cover").addClass("load") }) });
