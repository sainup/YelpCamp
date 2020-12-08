


    let options = {
        root:null,
        rootMargins : '0px',
        threshold : 0.5
    };
    
    const observer = new IntersectionObserver(handleIntersect,options);
    observer.observe(document.getElementById('bottomFooter'));
    
    let count = 10;

function handleIntersect(entries,observer) {


  for (let entry of entries){
      
          if(entry.isIntersecting){
              
              count+=10;
              console.warn('Content Visible')
              const form = document.createElement('form')
              form.action="/campgrounds"
              const scrollCount = document.createElement('input');
              scrollCount.name ='scrollCount'
              scrollCount.type='hidden'
              scrollCount.value=count;
              console.log(count);
            form.appendChild(scrollCount);
            document.body.appendChild(form);
            form.submit();
          }
      
  }
    
}