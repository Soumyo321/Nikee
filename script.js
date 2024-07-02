// Dropdown menus
document.addEventListener("mouseover", handleDropdown);
document.addEventListener("mouseout", handleDropdown);  // Added mouseout listener

function handleDropdown(event) {
    const target = event.target;  // Cache the target element

    // Check if the event originated from a dropdown button or within a dropdown
    if (target.matches("[data-dropdown-button]") || target.closest("[data-dropdown]") !== null) {

        const currentDropdown = target.closest("[data-dropdown]");

        // Use a timeout to avoid immediate closing on mouse movements within the dropdown
        if (event.type === "mouseover") {
            clearTimeout(currentDropdown.closeTimeout); // Clear any existing timeout
            currentDropdown.classList.add("active");
        } else if (event.type === "mouseout" && !currentDropdown.contains(event.relatedTarget)) {
            currentDropdown.closeTimeout = setTimeout(() => {
                currentDropdown.classList.remove("active");
            }, 200); // Add a slight delay (adjust as needed)
        }
    }
}

// code for the logo animation in the starting
// comment it out if you don't want the animation
// comment it out in development
// /*

document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("logo");
    // logo.style.zIndex = 1000; // Ensure the logo is on top of other elements

    // Get the original position of the logo (assuming it's initially hidden)
    const originalPosition = {
        x: logo.offsetLeft,
        y: logo.offsetTop
    };

    gsap.set(logo, {
        opacity: 0, // Logo starts invisible
        x: window.innerWidth / 2, // Center horizontally
        y: window.innerHeight / 2 // Center vertically
    });

    const tl = gsap.timeline();
    const originalWidth = 50; // Gets actual image width after loading
    const originalHeight = 50; // Gets actual image height after loading
    console.log(originalWidth, originalHeight)
    console.log(logo.clientWidth, logo.clientHeight)
    // Set the initial styles for the animation (image initially hidden and scaled up)
    gsap.set(logo, {
        opacity: 1, // Initially hidden
        scale: 12// Scaled up 3 times bigger (adjust as needed)
    });
    console.log(originalWidth, originalHeight)
    console.log(logo.clientWidth, logo.clientHeight)
    // Animate the logo to appear and move to its original position
    tl
        .to(logo, {
            duration: 1, // Adjust duration as needed (in seconds)
            ease: "power3.out", // Customize easing for animation smoothness
            opacity: 1, // Fade in
            scaleX: originalWidth / logo.clientWidth, // Scale X to original width
            scaleY: originalHeight / logo.clientHeight // Scale Y to original height
        })
        .to(logo, {
            duration: 2, // Adjust duration as needed (in seconds)
            ease: "power3.out", // Customize easing for animation smoothness
            opacity: 1, // Fade in
            x: originalPosition.x, // Move to original X position
            y: originalPosition.y // Move to original Y position
        });
});

// */

 // Search icon animation 
 // TODO: Add the search icon animation
var search = document.getElementById("search-icon");
var searchInput = document.getElementById("search-input")
search.addEventListener('click', (event) => {
    searchInput.classList.replace("input-hidden", "input-visible")
    console.log("class added")
})

// Scroll control video background
console.clear();
/* The encoding is super important here to enable frame-by-frame scrubbing. */
// ffmpeg -i ~/Downloads/Toshiba\ video/original.mov -movflags faststart -vcodec libx264 -crf 23 -g 1 -pix_fmt yuv420p output.mp4
// ffmpeg -i ~/Downloads/Toshiba\ video/original.mov -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output_960.mp4
const video = document.querySelector(".video-background");
let src = video.currentSrc || video.src;
// console.log(video, src);

/* Make sure the video is 'activated' on iOS */
function once(el, event, fn, opts) {
    var onceFn = function (e) {
        el.removeEventListener(event, onceFn);
        fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
}

once(document.documentElement, "touchstart", function (e) {
    video.play();
    video.pause();
});

/* ---------------------------------- */
/* Scroll Control! */

gsap.registerPlugin(ScrollTrigger);

let tl = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
        trigger: "#container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

once(video, "loadedmetadata", () => {
    tl.fromTo(
        video,
        {
            currentTime: 0
        },
        {
            currentTime: video.duration || 1
        }
    );
});

/* When first coded, the Blobbing was important to ensure the browser wasn't dropping previously played segments, but it doesn't seem to be a problem now. Possibly based on memory availability? */
setTimeout(function () {
    if (window["fetch"]) {
        fetch(src)
            .then((response) => response.blob())
            .then((response) => {
                var blobURL = URL.createObjectURL(response);

                var t = video.currentTime;
                once(document.documentElement, "touchstart", function (e) {
                    video.play();
                    video.pause();
                });

                video.setAttribute("src", blobURL);
                video.currentTime = t + 0.005;
            });
    }
}, 1000);

/* ---------------------------------- */


// For video fade transition at end but not required;

/*
var videoContainer = document.getElementById("container");

let fadetl = gsap.timeline({
    // defaults: {duration : }
    scrollTrigger: {
        trigger: "#container",
        // container screen
        start: "70% 60%", // can adjust better
        end: "90% 90%",
        scrub: true,
        markers: false 
    }
})

fadetl.to("#container", { backgroundColor: "white" }); // Change background color to white as the animation


fadetl.addLable('start')
*/





// smooth scroll from lenin
// this line give errorr
// import Lenis from 'lenis'  
const lenis = new Lenis()

lenis.on('scroll', (e) => {
    // console.log(e)
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
} 


requestAnimationFrame(raf)


function init(){
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});




// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

}
init()

var crsr = document.querySelector("#cursor")
var main = document.querySelector("#main")
main.addEventListener("mousemove",function(dets){
    crsr.style.left = dets.x+'px'
    crsr.style.top = dets.y+"px"

})
// var vdo = document.querySelector("#page video")
// vdo.addEventListener("mouseenter",function(){
//     // crsr.style.width = "23px"
//     crsr.style.width = "8vw"
//     crsr.innerHTML =" Sound On "
// })
// vdo.addEventListener("mouseleave",function(){
//     crsr.style.width ="20px";
//     crsr.innerHTML = " "
// })







var tl1 = gsap.timeline({
    scrollTrigger:{
        trigger:"#page h1",
        scroller:"#main",
        start:"top 27%",
        end:"top 0",
        scrub:3,
        // markers:true
    }
})
tl1.to("#page h1",{
    x:-100,
    opacity:"0"
},"koibhivar")

tl1.to("#page h3",{
    x:110,
    opacity:"0"
},"koibhivar")

tl1.to("#page h5",{
    x:-130,
    opacity:"0"
},"koibhivar")

//video scrolling e st laganor somoy oi particular div k height dibi na
tl1.to("#page video",{
    width:"90%"            
},"koibhivar")

var tl2 = gsap.timeline({
    scrollTrigger:{
        trigger:"#g1",
        scroller:"#main",
        start:"top -120%",
        end:"top -130%",
        scrub:3
    }
})


tl2.to("#main",{
    backgroundColor:"black",
    
})

tl2.to("#main",{
    backgroundColor:"black",
    
})

var tl3 = gsap.timeline({
    scrollTrigger:{
        trigger:"#g2",
        scroller:"#main",
        start:"top -100%",
        end:"top -100%",
        scrub:3,
        markers:true
    }
})

tl3.to("#main",{
    backgroundColor:"#0F0D0D"
})

