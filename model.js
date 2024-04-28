// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader(); //创建一个GLTF加载器
const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
// const group = new THREE.Group(); //创建一个组对象
let door;
// 创建新材质
// const newMaterial = new THREE.MeshStandardMaterial({
    // color: 0x00ff00,
    // metalness: 0.9,
    // roughness: 0.2
// });

loader.load("./合1.glb", function (gltf) {
    // model.scale.set(10, 10, 10);
    model.add(gltf.scene);

    // 计算模型的包围盒
    // const box = new THREE.Box3().setFromObject(model);
    // 计算包围盒的中心
    // const center = new THREE.Vector3();
    // box.getCenter(center);
    // 调整模型位置，使包围盒中心对齐到组的原点
    // model.position.sub(center);
    // group.add(model); // 将调整后的模型添加到组中


    model.traverse(function (child) {
        if (child.name === "炉_-_炉门-1") {
            door = child;
        }
        // 改变模型每部分材质
        // if (child instanceof THREE.Mesh) {
            // child.material = newMaterial;
        // }
        //遍历打印子节点名
        // console.log(child.name);
    });
})


export {model, door};

