import * as BASE from './Base'
import * as THREE from 'three'
import { Global } from '@/Codit/Libs/Global'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { FBXLoader, MTLLoader, OBJLoader, STLLoader } from 'three/examples/jsm/Addons.js'

function draw(container: HTMLDivElement, modelUrl: string) {
  const _container = container
  const _scene = BASE.createScene()
  const _camera = BASE.createCamera(_container)
  const _renderer = BASE.createRenderer(_container)

  const ext = Global.GetFileExtension(modelUrl)

  if (ext.toUpperCase().includes('OBJ')) createModelObj(_scene, modelUrl, _camera, _renderer)
  if (ext.toUpperCase().includes('GLTF') || ext.toUpperCase().includes('GLB'))
    createModelGltf(_scene, modelUrl, _camera, _renderer)
  if (ext.toUpperCase().includes('FBX')) createModelFbx(_scene, modelUrl, _renderer, _camera)
  if (ext.toUpperCase().includes('STL')) createModelStl(_scene, modelUrl, _renderer, _camera)

  BASE.creatLightD(_scene)
  BASE.creatAmbient(_scene)

  BASE.createRenderDom(_container, _renderer)

  BASE.rotateCamera(_scene, _camera, _renderer)
  BASE.orbitControls(_scene, _camera, _renderer)
}

function createModelGltf(
  scene: THREE.Scene,
  modelUrl: string,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()

  dracoLoader.setDecoderPath(BASE.decodeDracoPath)
  loader.setDRACOLoader(dracoLoader)

  loader.load(modelUrl, function (gltf) {
    scene.add(gltf.scene)
    BASE.fitOnScreen(scene, camera, renderer)
  })
}

function createModelObj(
  scene: THREE.Scene,
  modelUrl: string,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) {
  const mtlLoader = new MTLLoader()
  const objLoader = new OBJLoader()

  const ext = Global.GetFileExtension(modelUrl)
  const mtlUrl = modelUrl.replace(ext, 'mtl')

  mtlLoader.load(mtlUrl, (materials: MTLLoader.MaterialCreator) => {
    materials.preload()
    objLoader.setMaterials(materials).load(modelUrl, (object: THREE.Object3D) => {
      scene.add(object)
      BASE.fitOnScreen(scene, camera, renderer)
    })
  })
}

function createModelFbx(
  scene: THREE.Scene,
  modelUrl: string,
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera
) {
  const loader = new FBXLoader()
  loader.load(modelUrl, function (fbx) {
    scene.add(fbx)
    BASE.fitOnScreen(scene, camera, renderer)

    if (fbx.animations && fbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(fbx)
      const animationAction = mixer.clipAction(fbx.animations[0])
      animationAction.play()

      // eslint-disable-next-line no-inner-declarations
      function animate() {
        requestAnimationFrame(animate)
        mixer.update(0.01)
        renderer.render(scene, camera)
      }
      animate()
    }
  })
}

function createModelStl(
  scene: THREE.Scene,
  modelUrl: string,
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera
) {
  const loader = new STLLoader()

  loader.load(
    modelUrl,

    function (geometry) {
      const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
      const mesh = new THREE.Mesh(geometry, material)

      scene.add(mesh)
      BASE.fitOnScreen(scene, camera, renderer)

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }
      animate()
    }
  )
}

export { draw }
