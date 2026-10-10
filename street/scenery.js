/* Shared-canvas artwork is positioned from its supplied alpha bounds. */
window.orbitStreetArt = (() => {
  const src = name => `./assets/supplement/${name}.png`;
  function crop(name, box, cls = '', canvas = [2048,2048]) {
    const [x,y,w,h] = box;
    return `<span class="art-crop ${cls}" style="width:${w}px;height:${h}px"><img src="${src(name)}" alt="" draggable="false" style="left:${-x}px;top:${-y}px;width:${canvas[0]}px;height:${canvas[1]}px"></span>`;
  }
  function part(name, box, base, cls = '', canvas) {
    return `<div class="art-part ${cls}" style="left:${box[0]-base[0]}px;top:${box[1]-base[1]}px;width:${box[2]}px;height:${box[3]}px">${crop(name,box,'',canvas)}</div>`;
  }
  function rig(base, width, content) {
    return `<div class="real-prop" style="width:${base[2]}px;height:${base[3]}px;--art-scale:${width/base[2]}">${content}</div>`;
  }
  function realProp(id) {
    if (id === 'cat') {
      const base=[348,517,1025,602];
      return rig(base,190,part('趴着的猫',[348,711,1025,327],base,'cat-idle')+part('坐着的猫',[425,517,942,602],base,'cat-sitting'));
    }
    if (id === 'kq') {
      const base=[217,360,1419,1264];
      return rig(base,480,crop('KQ',base)+part('左门1',[684,1413,154,163],base,'door-left door-closed')+part('左门2',[682,1409,31,167],base,'door-left door-open')+part('右门1',[822,1419,178,162],base,'door-right door-closed')+part('右门2',[969,1411,31,175],base,'door-right door-open'));
    }
    if (id === 'coffee') {
      const base=[324,494,1370,1047];
      return rig(base,500,crop('咖啡店',base)+`<div class="clerk-window" style="left:771px;top:470px;width:245px;height:270px">${part('咖啡店员',[1095,984,201,240],[1095,964], 'clerk-part')}</div>`);
    }
    if (id === 'gift') {
      const base=[160,417,1696,1143];
      return rig(base,480,crop('橱窗',base)+part('泰迪熊',[803,938,273,331],base,'teddy-part'));
    }
    if (id === 'magazine') {
      const base=[456,248,1044,1106];
      return rig(base,350,crop('杂志架',base)+`<button class="magazine-button" type="button" aria-label="翻阅杂志" style="left:445px;top:624px;width:291px;height:249px">${part('杂志1',[926,872,201,249],[901,872],'magazine-front')}${part('杂志2',[0,0,330,282],[0,0],'magazine-back',[330,282])}</button>`);
    }
    if (id === 'billboard') return rig([0,0,1502,1048],490,crop('广告牌',[0,0,1502,1048],'billboard-art',[1502,1048]));
    if (id === 'restaurant') {
      const base=[432,240,1174,1245];
      return rig(base,490,crop('餐厅',base)+part('风铃',[629,838,154,334],base,'chime-part')+part('餐厅招牌发光',[0,0,561,123],[-320,-48],'restaurant-glow',[561,123]));
    }
    return '';
  }
  const alpha = new Map();
  function magazineHit(event) {
    const button=event.target.closest('.magazine-button');
    if (!button) return false;
    if (event.detail === 0) return true; // keyboard activation
    const flipped=button.closest('.prop').classList.contains('is-flipped');
    const image=button.querySelector(flipped ? '.magazine-back img' : '.magazine-front img');
    if (!image.complete || !image.naturalWidth) return false;
    const bounds=image.getBoundingClientRect();
    const x=Math.floor((event.clientX-bounds.left)/bounds.width*image.naturalWidth);
    const y=Math.floor((event.clientY-bounds.top)/bounds.height*image.naturalHeight);
    if(x<0||y<0||x>=image.naturalWidth||y>=image.naturalHeight)return false;
    let pixels=alpha.get(image.src);
    if (!pixels) {
      const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
      pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;alpha.set(image.src,pixels);
    }
    return pixels[(y*image.naturalWidth+x)*4+3]>32;
  }
  function drinkMarkup(id) {
    const specs={americano:['americano',[335,284,416,645],[2048,2048]],chamomile:['洋甘菊茶',[372,250,534,795],[2048,2048]],strawberry:['草莓奶昔',[0,0,561,952],[561,952]]};
    const [name,box,canvas]=specs[id];
    return `<div style="transform:scale(${68/box[3]});transform-origin:top left">${crop(name,box,'',canvas)}</div>`;
  }
  return {realProp,magazineHit,drinkMarkup};
})();
