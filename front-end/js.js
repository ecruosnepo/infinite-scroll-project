// 무한 스크롤
const imageList = document.querySelector(".image-list");
const moreBtn = document.querySelector(".more-btn");
const subscribeBtn = document.querySelector(".subscribeBtn");
const modal = document.querySelector(".modal");
let moreBtnClick = false;
let pageNumber = 1;

//io 생성자에 매개변수로 들어가는 callback 함수
const ioImage = (entries, io)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting && moreBtnClick){
            io.unobserve(entry.target);
            fetchImages(++pageNumber);
        }
    });
}
async function fetchImages(page){
    try{
        const response = await fetch('https://picsum.photos/v2/list?page='+ page +'&limit=6');
        if(!response.ok){
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        const datas =  await response.json();

        makeImageList(datas);
    }catch(error){
        console.error('데이터를 가져오는데 문제가 발생했습니다 :', error);
    }
}

function makeImageList (datas){
    console.log('이미지 목록 생성');
    datas.forEach((item, idx, array)=>{
        imageList.innerHTML += "<img src="+item.download_url+" alt=''>";
        if(idx===array.length -1){
            io.observe(imageList.lastElementChild);
        }
    });
}

moreBtn.addEventListener('click', ()=>{
    document.querySelector(".more-btn-area").style.display = "none";
    moreBtnClick = true;
    fetchImages(++pageNumber);
})

const io = new IntersectionObserver(ioImage,{threshold:0.8});
fetchImages(1);

//모달
subscribeBtn.addEventListener('click', ()=>{
    modal.style.display="flex";
})

document.querySelector(".modal-btn").addEventListener('click',()=>{
    modal.style.display="none";
})