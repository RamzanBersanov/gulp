let element = document.querySelector('.consultation__surnum');
let maskOptions = {
  mask: '+7(000)000-00-00',
  lazy:false
}

let mask = new IMask(element, maskOptions);