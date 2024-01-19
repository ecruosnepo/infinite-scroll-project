const imageList = document.querySelector(".image-list");
const moreBtn = document.querySelector(".more-btn");
const subscribeBtn = document.querySelector(".subscribeBtn");
const modal = document.querySelector(".modal");
const topBtn = document.querySelector(".top-btn");
let moreBtnClick = false;
let pageNumber = 1;

//교차가 감지되면 실행할 callback 함수
const ioImage = (entries, io)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting && moreBtnClick){
            let timer = null;
            if(timer === null){
                timer = setTimeout(()=>{
                    console.log('교차 감지');
                    fetchImages();
                    timer = null;
                },100);
            }
        }
    });
}

const io = new IntersectionObserver(ioImage,{threshold:0.2});

// 사진 불러와서 저장
async function fetchImages(){
    try{
        const response = await fetch('https://picsum.photos/v2/list?page='+ pageNumber +'&limit=6');
        if(!response.ok){
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        const images =  await response.json();
        io.disconnect();
        makeImageList(images);
    }catch(error){
        console.error('데이터를 가져오는데 문제가 발생했습니다 :', error);
    }
}

// 저장한 사진을 .image-list의 자식 요소로 추가해줌
function makeImageList (images){
    console.log('이미지 목록 생성');
    images.forEach((item, idx, array)=>{
        imageList.innerHTML += "<img src="+item.download_url+" alt='사진' loading='lazy' decoding='async'>";
        if(idx === images.length-1){
            io.observe(imageList.lastElementChild);
        }
    });
    pageNumber++;
}

//버튼 누르면 이미지 6장 불러오고 io 활성화
moreBtn.addEventListener('click', ()=>{
    document.querySelector(".more-btn-area").style.display = "none";
    moreBtnClick = true;
    fetchImages();
})

// 최초 사진 6장 불러오기
fetchImages();

//모달 드러내기
subscribeBtn.addEventListener('click', ()=>{
    modal.style.display="flex";
})

//모달 숨기기
document.querySelector(".modal-btn").addEventListener('click',()=>{
    modal.style.display="none";
})

//부드럽게 맨 위로 스크롤 하는 버튼
topBtn.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
});

//카카오 지도
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(33.4423379727783, 126.571449734542),
    level: 3
};
var map = new kakao.maps.Map(container, options);
var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커가 표시될 위치입니다
var markerPosition  = new kakao.maps.LatLng(33.4423379727783, 126.571449734542);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);