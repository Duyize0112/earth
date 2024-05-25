import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import model from './demo/sphere'

let camera, scene, renderer, stats,gui,settings={};
function init() {
  // 场景
  scene = new THREE.Scene();
  //添加物体

  scene.add(model);

  // 相机
  camera = new THREE.PerspectiveCamera(
    75, // 视野角度
    window.innerWidth / window.innerHeight, // 长宽比
    0.1, // 近截面（near）
    500 // 远截面（far）
  );
  camera.position.set(50, 50, 50);
  camera.lookAt(0, 0, 0);

  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);


  // 渲染器
  renderer = new THREE.WebGLRenderer({antialias: true});
  // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.render(scene, camera);
  //阴影  渲染器打开阴影的渲染

  renderer.shadowMap.enabled=true;
  //背景颜色
  renderer.setClearColor(0x000000, 1);
  document.body.appendChild(renderer.domElement);
  
  // window.addEventListener('resize', onWindowResize);
  window.onresize = onWindowResize;
  initHelper();
  initGUI(ambientLight);
}

function animate() {
  // 浏览器刷新的时候渲染器重新渲染
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  const delta=clock.getDelta();
  birds.forEach(bird=>bird.tick(delta))
  stats.update();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
}

function initHelper() {
  //辅助线
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => {
    renderer.render(scene, camera);
  });

  //网格
  const gridHelper = new THREE.GridHelper(1000, 100);
  scene.add(gridHelper);

  //创建stats对象
  stats = new Stats();
  //stats.domElement:web页面上输出计算结果,一个div元素，
  document.body.appendChild(stats.domElement);
}
function initGUI(ambientLight){
  const gui = new GUI();
  const obj = {
    x: 1,
    intensity: 1
  }
  //各种控件，plane专用
  // gui.add(obj, 'x', -10, 10, 2).name('x的值')
  // gui.add(ambientLight,'intensity',0,4).name('环境光强度')

  // 创建文件夹并将控件添加到文件夹中
  const guiFolder = gui.addFolder('模式设置');
  guiFolder.addColor(model.material, 'color').name('颜色');
  guiFolder.add(model.position, 'x', [0, 1, 2, 4, 8]).name('X位置');
  guiFolder.add(model.position, 'x', {
    min: -10,
    max: 10,
  }).name('X位置范围');
  guiFolder.add(model.position, 'y', [0, 1, 2, 4, 8]).name('X位置');
  guiFolder.add(model.position, 'y', {
    min: -10,
    max: 10,
  }).name('y位置范围');
  guiFolder.add(model.material, 'transparent').name('是否透明');
}

init();
animate();
