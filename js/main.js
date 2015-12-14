var flakes = [],
    canvas = document.getElementById("canvas"),
    regio = document.getElementById("regio"),
    innerTop = document.getElementById("innerTop"),
    innerBottom = document.getElementById("innerBottom"),
    extraheight = document.getElementById("createSpace"),
    ctx = canvas.getContext("2d"),
    flakeCount = 1000,
    mX = -100,
    mY = -100,
    body = document.body,
    html = document.documentElement,
    screenheight = window.innerHeight,
    docheight = regio.scrollHeight,
    snowBorder = document.getElementById("snowBorder"),
    didScroll = false,
    yOffset = 0,
    tStart = 100, // Start transition 100px from top
    tEnd = docheight,   // End at 100000px
    cStart = [53, 137, 182],  // #1
    cEnd = [166, 222, 255],   // #2 [220, 245, 255]
    cDiff = [cEnd[0] - cStart[0], cEnd[1] - cStart[1], cEnd[1] - cStart[0]]


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
regio.style.height = window.innerHeight + "px";
regio.style.width = window.innerWidth + "px";
innerTop.style.height = window.innerHeight + "px";
innerBottom.style.height = window.innerHeight + "px";


$(document).ready(function () {



    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;

    setInterval(function () {
        if (didScroll) {
            didScroll = false;
            move();
        }
    }, 10);
});

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < flakeCount; i++) {
        var flake = flakes[i],
            x = mX,
            y = mY,
            minDist = 150,
            x2 = flake.x,
            y2 = flake.y;

        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y;

        if (dist < minDist) {
            var force = minDist / (dist * dist),
                xcomp = (x - x2) / dist,
                ycomp = (y - y2) / dist,
                deltaV = force / 2;

            flake.velX -= deltaV * xcomp;
            flake.velY -= deltaV * ycomp;

        } else {
            flake.velX *= .98;
            if (flake.velY <= flake.speed) {
                flake.velY = flake.speed
            }
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY;
        flake.x += flake.velX;

        if (flake.y >= canvas.height || flake.y <= 0) {
            reset(flake);
        }


        if (flake.x >= canvas.width || flake.x <= 0) {
            reset(flake);
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(snow);
};

function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = 0;
    flake.size = (Math.random() * 3) + 2;
    flake.speed = (Math.random() * 1) + 0.5;
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = (Math.random() * 0.5) + 0.3;
}

function init() {
    for (var i = 0; i < flakeCount; i++) {
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * 3) + 2,
            speed = (Math.random() * 1) + 0.5,
            opacity = (Math.random() * 0.5) + 0.3;

        flakes.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            angle: 180,
            opacity: opacity
        });
    }

    snow();
};
init();

function move() {
    yOffset = $('#regio').scrollTop();
    snowBorder.style.bottom = (yOffset / (docheight / 100) ) - (snowBorder.clientHeight) + "px";
    if (!(yOffset < docheight - screenheight)) {
        $('#snowBorder, #snowBorder > span.sociallinks').addClass("showFull")
    } else {
        $('#snowBorder, #snowBorder span.sociallinks').removeClass("showFull");
    }

    var p = ($("#regio").scrollTop() - tStart) / (tEnd - tStart); // % of transition
    p = Math.min(1, Math.max(0, p)); // Clamp to [0, 1]
    var cBg = [Math.round(cStart[0] + cDiff[0] * p), Math.round(cStart[1] + cDiff[1] * p), Math.round(cStart[2] + cDiff[2] * p)];
    $("body").css('background-color', 'rgb(' + cBg.join(',') + ')');
}
$('#information a').click(function (e) {
    e.preventDefault();
    $(this).parent().toggleClass("active");
});

$('#regio').scroll(function () {
    clearTimeout($.data(this, 'scrollTimer'));
    didScroll = true;
    $('#keepOnScroll').removeClass("active");
    $.data(this, 'scrollTimer', setTimeout(function() {
        if((yOffset < docheight - screenheight) && (yOffset > screenheight)) {
            $('#keepOnScroll').addClass("active");
        } else{
            $('#keepOnScroll').removeClass("active");
        }

    }, 2000));
});
regio.addEventListener("mousemove", function (e) {
    mX = e.clientX,
        mY = e.clientY;
});