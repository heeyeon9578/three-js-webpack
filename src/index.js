import * as THREE from 'three'
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  //장면 생성
  const scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x000000);

  //카메라 생성
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  //렌더러 생성
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  document.body.appendChild(renderer.domElement);

  // 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // 텍스처 로더 생성
  const textureLoader = new THREE.TextureLoader();
  
  // 텍스처 로딩
  textureLoader.load(
    '../static/textures/Alien_Flesh_001_color.jpg',
    function(texture) {
      // 텍스처가 로드되면 실행되는 콜백
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      //매쉬 생성 - 세부 수준 감소
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const geometry3 = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
      const geometry5 = new THREE.IcosahedronGeometry(0.5, 0);

      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
       // wireframe: true,
        opacity: 0.5,
        transparent: true
      });
      const material3 = new THREE.MeshStandardMaterial({ 
        map: texture,
        opacity: 0.5,
        metalness: 0.5,
        roughness: 0.5,
        transparent: true
      });
      const material5 = new THREE.MeshStandardMaterial({ 
        map: texture,
       // wireframe: true,
        opacity: 0.5,
        transparent: true
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -1;
      const cube3 = new THREE.Mesh(geometry3, material3);
      cube3.position.x = 0;
      const cube5 = new THREE.Mesh(geometry5, material5);
      cube5.position.x = -2;

      scene.add(cube);
      scene.add(cube3);
      scene.add(cube5);
    },
    undefined, // 진행 콜백
    function(error) {
      console.error('텍스처 로딩 중 오류 발생:', error);
    }
  );

  let animationFrameId;
  function render(time) {
    time *= 0.0005;
    
    if (scene.children.length > 2) { // 조명을 제외한 메시가 있는 경우에만 회전
      const cube = scene.children[2];
      const cube3 = scene.children[3];
      const cube5 = scene.children[4];
      
      cube.rotation.x = time;
      cube.rotation.y = time;
      cube3.rotation.x = time;
      cube3.rotation.y = time;
      cube5.rotation.x = time;
      cube5.rotation.y = time;
    }
    
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  }
  window.addEventListener('resize', onWindowResize);

  window.addEventListener('unload', () => {
    cancelAnimationFrame(animationFrameId);
    renderer.dispose();
  });
  
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
