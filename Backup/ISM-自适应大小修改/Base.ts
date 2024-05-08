import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const decodeDracoPath = 'threejs/examples/jsm/libs/draco/'

//-----------------------------------------

function createScene() {
  const _scene = new THREE.Scene()
  return _scene
}

//-----------------------------------------

function createCamera(
  _container: HTMLDivElement,
  _fov = 75,
  _near = 0.5,
  _far = 1000,
  _x = 0,
  _y = 1.5,
  _z = 5
) {
  const _ratio = calcCameraRatio(_container)
  const _camera = new THREE.PerspectiveCamera(_fov, _ratio, _near, _far)
  _camera.position.x = _x
  _camera.position.y = _y
  _camera.position.z = _z

  return _camera
}

//-----------------------------------------

function createRenderer(_container: HTMLDivElement) {
  const _width = parseInt(_container.style.width)
  const _height = parseInt(_container.style.height)
  const _renderer = new THREE.WebGLRenderer({ alpha: true })
  _renderer.setSize(_width, _height)

  return _renderer
}

//-----------------------------------------

function creatLightD(
  _scene: THREE.Scene,
  _color = 0xffffff,
  _strength = 1,
  _x = 100,
  _y = 60,
  _z = 50
) {
  const _light = new THREE.DirectionalLight(_color, _strength)
  _light.position.set(_x, _y, _z)
  _light.castShadow = true
  _scene.add(_light)

  return _light
}

//-----------------------------------------

function creatAmbient(_scene: THREE.Scene, _color = 0xffffff, _strength = 0.8) {
  const _ambient = new THREE.AmbientLight(_color, _strength)
  _scene.add(_ambient)

  return _ambient
}

//-----------------------------------------

function rotateCamera(
  _scene: THREE.Scene,
  _camera: THREE.Camera,
  _renderer: THREE.Renderer,
  _axis = 'y',
  _speed = 0.003
) {
  function rotate() {
    switch (_axis.toLowerCase()) {
      case 'x':
        _scene.rotation.x += _speed
        break
      case 'y':
        _scene.rotation.y += _speed
        break
      case 'z':
        _scene.rotation.z += _speed
        break
      default:
        break
    }
    requestAnimationFrame(rotate)
    _renderer.render(_scene, _camera)
  }
  rotate()
}

//-----------------------------------------

function orbitControls(_scene: THREE.Scene, _camera: THREE.Camera, _renderer: THREE.Renderer) {
  const _controls = new OrbitControls(_camera, _renderer.domElement)
  _controls.addEventListener('change', function () {
    _renderer.render(_scene, _camera)
  })
}

//-----------------------------------------

function calcCameraRatio(_container: HTMLDivElement) {
  const _width = parseInt(_container.style.width)
  const _height = parseInt(_container.style.height)
  const _ratio = _width / _height
  return _ratio
}

//-----------------------------------------

function createRenderDom(_container: HTMLDivElement, _renderer: THREE.Renderer) {
  const _renderDom = _renderer.domElement
  _renderDom.style.width = _container.style.width
  _renderDom.style.height = _container.style.height

  _container.append(_renderDom)

  return _renderDom
}

function fitOnScreen(_scene: THREE.Scene, _camera: THREE.Camera, _renderer: THREE.Renderer) {
  const box = new THREE.Box3().setFromObject(_scene)
  const boxSize = box.getSize(new THREE.Vector3()).length()
  const boxCenter = box.getCenter(new THREE.Vector3())

  frameArea(_camera, boxSize * 1.1, boxSize, boxCenter)

  const _controls = new OrbitControls(_camera, _renderer.domElement)

  _controls.maxDistance = boxSize * 10
  _controls.target.copy(boxCenter)
  _controls.update()
}

function frameArea(
  _camera: THREE.Camera,
  sizeToFitOnScreen: number,
  boxSize: number,
  boxCenter: THREE.Vector3
) {
  const _pCamera = _camera as THREE.PerspectiveCamera

  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
  const halfFovY = THREE.MathUtils.degToRad((_camera as THREE.PerspectiveCamera).fov * 0.5)
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)

  const direction = new THREE.Vector3()
    .subVectors(_camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize()

  _pCamera.position.copy(direction.multiplyScalar(distance).add(boxCenter))

  _pCamera.near = boxSize / 100
  _pCamera.far = boxSize * 100
  _pCamera.updateProjectionMatrix()
  _camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
}

//-----------------------------------------

export {
  decodeDracoPath,
  createScene,
  createCamera,
  createRenderer,
  creatAmbient,
  createRenderDom,
  creatLightD,
  fitOnScreen,
  rotateCamera,
  orbitControls
}
