import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import  {model, door}  from './model.js';//模型对象

//场景
const scene = new THREE.Scene();
scene.add(model); //模型对象添加到场景中



//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

//光源设置
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(200, 200, 200);
scene.add(directionalLight);
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);


//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
//canvas画布背景颜色
//第二个参数是alpha通道（不透明）
renderer.setClearColor(0xFAD7A0, 1); 
document.body.appendChild(renderer.domElement);


const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0.5;
outlinePass.edgeThickness = 1;
outlinePass.visibleEdgeColor.set('#ffffff');
outlinePass.hiddenEdgeColor.set('#190a05');
composer.addPass(outlinePass);


//解决加载gltf格式模型颜色偏差问题
// renderer.outputColorSpace = THREE.SRGBColorSpace;//设置为SRGB颜色空间

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
controls.update();


// 开关门逻辑实现
let doorOpen = true; // 门当前是否打开
function toggleDoor() {
    if (door) {
        door.position.y += doorOpen ? -3 : 3; // 切换门的位置
        doorOpen = !doorOpen; // 切换门状态
    }
}


// 绑定开关门按钮事件
document.getElementById('openDoor').addEventListener('click', function () {
    if (!doorOpen) { // 门是关的时，才允许开门
        toggleDoor();
    }
});

document.getElementById('closeDoor').addEventListener('click', function () {
    if (doorOpen) { // 门是开的时，才允许关门
        toggleDoor();
    }
});


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// 控制旋转的状态标志
let isRotating = false; 
let allowRotation = false;


let INTERSECTED;
function onMouseMove(event) {
    event.preventDefault();
    // 将鼠标位置转换为归一化设备坐标(NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线投射器的射线
    raycaster.setFromCamera(mouse, camera);
    
    // 检查射线与模型的交集
    const intersects = raycaster.intersectObject(model, true);

    allowRotation ? isRotating = !intersects.length : isRotating = false;

    // 高亮显示模型各模块
    if (intersects.length > 0) {
        if (INTERSECTED !== intersects[0].object) {
            INTERSECTED = intersects[0].object;
            outlinePass.selectedObjects = [INTERSECTED];
        }
    } else {
        outlinePass.selectedObjects = [];
        INTERSECTED = null;
    }
}

window.addEventListener('mousemove', onMouseMove, false);


// 添加鼠标事件监听
document.getElementById('startRotate').addEventListener('click', function() {
    allowRotation = true;
    isRotating = true;
});
document.getElementById('stopRotate').addEventListener('click', function() {
    allowRotation = false;
    isRotating = false;
});
// renderer.domElement.addEventListener('mousedown', function () {
//     isRotating = false; // 当鼠标按下时停止旋转
// });
// renderer.domElement.addEventListener('mouseup', function () {
//     isRotating = true; // 当鼠标松开时继续旋转
// });


// 点击放大物体子模块
window.addEventListener('click', function(event) {
    event.preventDefault();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
        const target = intersects[0].object;
        const newTargetPos = target.getWorldPosition(new THREE.Vector3());
        const zoomPosition = newTargetPos.clone().add(new THREE.Vector3(0, 0, 5));
        camera.position.lerp(zoomPosition, 0.5);
        controls.target.copy(newTargetPos);
        controls.update();
    }
});


// 渲染循环
function render() {
    if (isRotating) {
        model.rotateY(0.02); // 仅当isRotating为true时旋转模型
    }
    // model.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    composer.render();
}
render();


// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    composer.setSize(window.innerWidth, window.innerHeight);
};

