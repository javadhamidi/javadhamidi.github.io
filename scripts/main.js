import * as THREE from '/scripts/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 6 / 4, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(600, 400);
camera.position.set(-500, 200, 30);

renderer.render(scene, camera);


// WINDOW DRAGGING

const star_window = document.getElementById('window');
const blog_window = document.getElementById('blog');

const cursor = document.getElementById('cursor');
let window_view = blog_window;
const desktop_icons = document.getElementsByClassName('desktop-icon');

let window_clicked = false;
let offset_x = 0, offset_y = 0;

function clickWindow(e) {
	offset_x = Number(window_view.style.left.replace('px', '')) - e.clientX;
	offset_y = Number(window_view.style.top.replace('px', '')) - e.clientY;

	window_clicked = true;
}

star_window.addEventListener('mousedown', e => {
	window_view = star_window;
	star_window.style.zIndex = +blog_window.style.zIndex + 1;
	clickWindow(e)
});

blog_window.addEventListener('mousedown', e => {
	window_view = blog_window;
	blog_window.style.zIndex = +star_window.style.zIndex + 1;
	clickWindow(e)
});


document.addEventListener('mouseup', e => { window_clicked = false; });

document.addEventListener('mousemove', e => {
	if (window_clicked) {
		window_view.style.left = Number(e.clientX) + Number(offset_x) + 'px';
		window_view.style.top = Number(e.clientY) + Number(offset_y) + 'px';

		if (window_view == star_window) {
			camera.position.x = (Number(e.clientX) + Number(offset_x) - 700);
			camera.position.y = -(Number(e.clientY) + Number(offset_y) - 300);
		}
	}
	cursor.style.left = e.clientX + 'px';
	cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', e => { cursor.style.display = 'block' });
document.addEventListener('mouseleave', e => { cursor.style.display = 'none' });


document.addEventListener('click', function (e) {
	e = e || window.event;
	let target = e.target || e.srcElement,
		text = target.textContent || target.innerText;

	if (!target.classList.contains('i')) {
		for (let index = 0; index < desktop_icons.length; index++)
			document.getElementsByClassName('icon-title')[index].classList.remove("selected");
	}
}, false);


for (let index = 0; index < desktop_icons.length; index++) {
	desktop_icons[index].addEventListener('click', e => {
		for (let index = 0; index < desktop_icons.length; index++)
			document.getElementsByClassName('icon-title')[index].classList.remove("selected");

		document.getElementsByClassName('icon-title')[index].classList.add("selected");
	});
}


// STARS

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
	const z = Array(1).fill().map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}

Array(2000).fill().forEach(addStar);



function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();