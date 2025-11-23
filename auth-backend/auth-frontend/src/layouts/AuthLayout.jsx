import React, {useEffect} from 'react';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function particlesInit() {
    const generator =  document.getElementById("particleGenerator");
    if (!generator) return;

    if(generator.childElementCount > 0) return;

    const particleCount = 200;
    const fragment = document.createDocumentFragment();

    for (let i=0; i < particleCount; i++) {
        const size = getRandomInt(2, 6);
        const particle = document.createElement("div");

        particle.className = "particle";
        particle.style.cssText = `
            top: ${getRandomInt(15, 95)}%;
            left: ${getRandomInt(5,95)}%;
            width: ${size}px;
            height: ${size}px;
            animation-delay: ${getRandomInt(0,30)/10}s;
            background-color: rgba(
                ${getRandomInt(80, 160)},
                ${getRandomInt(185, 255)},
                ${getRandomInt(160, 255)},
                ${getRandomInt(2, 8)/10}
            )`;
        
        fragment.appendChild(particle);
    }
    generator.appendChild(fragment);
}

function AuthLayout({ children }) {
    useEffect(() => {
        particlesInit();
    }, []);

    return (
        <>
            <div id="bg1"></div>
            <div id="bg2"></div>
            <div id="particleGenerator"></div>

            <main>{children}</main>
        </>
    )
}

export default AuthLayout;
