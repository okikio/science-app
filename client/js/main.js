var Image = window.Image,
    $ = window.$,
    Element = window.Element,
    CharacterData = window.CharacterData,
    DocumentType = window.DocumentType,
    Node = window.Node,
    Navbar = $(".navbar"),
    Menu = $(".navbar-menu"),
    Body = $("html, body"),
    FootTop = $(".footer-top"),
    NavList = $(".navbar-list"),
    LoadImg = $("load-img");
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/before()/before().md
// Polyfill for IE
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('before')) { return; }
        Object.defineProperty(item, 'before', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function before() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.parentNode.insertBefore(docFrag, this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
Menu.on("click", function() {
    return NavList.toggleClass("navbar-list-show"), Navbar[(window.scrollY < 50 && $(window).width() < 700 && !NavList.hasClass("navbar-list-show") ? 'remove' : 'add') + 'Class']("navbar-focus")
});
FootTop.on("click", function() {
    Body.animate({ scrollTop: 0 }, 500)
});
$(window).scroll(function() {
    Navbar[(window.scrollY > 50 || NavList.hasClass("navbar-list-show") && $(window).width() < 700 ? 'add' : 'remove') + 'Class']("navbar-focus")
});
$(document).ready(function() {
    $("div.cover").on("click", function() {
        $(this).removeClass("load");
    });
    setTimeout(function() {
        $("div.cover").removeClass("load");
        $("a[href|='/']").click(function(e) {
            $("div.cover").addClass("load");
        });
    }, 500);
    LoadImg.each(function(o, a) {
        var t = new Image,
            n = a.getAttribute("src"),
            e = a.getAttribute("alt"),
            r = a.getAttribute("class");
        t.onload = function() {
                var o = $(t);
                o.attr("alt", e), o.attr("class", r), a.before(o.get(0)), $(a).remove()
            },
            t.onerror = function(o) {
                console.log("One of the images didn't load " + o)
            }, t.src = n
    });
});
