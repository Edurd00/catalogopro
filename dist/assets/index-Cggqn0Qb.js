(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function i(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=i(r);fetch(r.href,s)}})();const N=(e,t)=>{const i=document.documentElement;e&&(i.style.setProperty("--color-primary",e),i.style.setProperty("--cor-primaria",e)),t&&(i.style.setProperty("--color-secondary",t),i.style.setProperty("--cor-secondary",t))},w=null;class ee{constructor(){this.state={tenant:null,cart:JSON.parse(localStorage.getItem("cart"))||[],listeners:[]}}subscribe(t){return this.state.listeners.push(t),()=>{this.state.listeners=this.state.listeners.filter(i=>i!==t)}}notify(){this.state.listeners.forEach(t=>t(this.getState()))}getState(){return{tenant:this.state.tenant,cart:this.state.cart}}async initTenant(){try{if(!w){this.state.tenant||(this.state.tenant={store_name:"Catálogo Pro",primary_color:"#3b82f6",secondary_color:"#1e3a8a",whatsapp_number:"5511999999999"},N(this.state.tenant.primary_color,this.state.tenant.secondary_color));return}const t=new URLSearchParams(window.location.search),i=t.get("store"),o=t.get("page")==="admin";let r=w.from("tenant_settings").select("*");if(i)r=r.eq("slug",i).maybeSingle();else if(o){const{data:{session:d}}=await w.auth.getSession();if(d!=null&&d.user){if(d.user.email==="admin@catalogopro.com")return;r=r.eq("owner_id",d.user.id).maybeSingle()}else return}else return;const{data:s,error:c}=await r;if(c){console.warn("Erro ao carregar tenant:",c.message);return}s&&(this.state.tenant=s,N(s.primary_color,s.secondary_color),this.notify())}catch(t){console.warn("Erro ao inicializar tenant:",t.message)}}setTenant(t){this.state.tenant=t,t&&N(t.primary_color,t.secondary_color),this.state.cart=[],localStorage.removeItem("cart"),this.notify()}addToCart(t,i=1,o={}){const r=`${t.id}-${btoa(JSON.stringify(o))}`,s=this.state.cart.findIndex(c=>c.cartItemId===r);s>-1?this.state.cart[s].quantity+=i:this.state.cart.push({cartItemId:r,product:t,quantity:i,selectedAttributes:o}),this.saveCart()}removeFromCart(t){this.state.cart=this.state.cart.filter(i=>i.cartItemId!==t),this.saveCart()}clearCart(){this.state.cart=[],this.saveCart()}saveCart(){localStorage.setItem("cart",JSON.stringify(this.state.cart)),this.notify()}}const P=new ee,S={show(e,t="success"){const i=document.getElementById("toast-container")||this.createContainer(),o=document.createElement("div"),r=t==="success"?"bg-green-50":"bg-red-50",s=t==="success"?"border-green-200":"border-red-200",c=t==="success"?"text-green-800":"text-red-800",d=t==="success"?'<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>':'<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';o.className=`flex items-center gap-3 ${r} ${s} border ${c} px-6 py-4 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top duration-300 min-w-[300px]`,o.innerHTML=`
      <div class="flex-shrink-0">${d}</div>
      <p class="text-sm font-bold uppercase tracking-tight">${e}</p>
    `,i.appendChild(o),setTimeout(()=>{o.classList.replace("animate-in","animate-out"),o.classList.add("fade-out","duration-500"),setTimeout(()=>o.remove(),500)},4e3)},createContainer(){const e=document.createElement("div");return e.id="toast-container",e.className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[90vw] md:max-w-md items-center",document.body.appendChild(e),e}},G={render(e,t={}){var f;const i=t.opt1Label||"Opções",o=t.opt2Label||"Variações",r=e.promo_price&&Number(e.promo_price)<Number(e.price),s=r?e.promo_price:e.price,c=r?Math.round((Number(e.price)-Number(e.promo_price))/Number(e.price)*100):0,d=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),y=[];return e.image_url&&y.push(e.image_url),Array.isArray(e.image_urls)&&e.image_urls.forEach(n=>{n&&!y.includes(n)&&y.push(n)}),y.length===0&&y.push("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000"),`
      <div id="product-modal-root" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" id="modal-backdrop"></div>

        <!-- Modal Card -->
        <div class="bg-white dark:bg-gray-900 w-full sm:max-w-4xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl shadow-black/30 overflow-hidden relative
                    flex flex-col sm:flex-row animate-in fade-in slide-in-from-bottom duration-350 sm:slide-in-from-bottom-0 sm:zoom-in-95 max-h-[95vh] sm:max-h-[88vh]">

          <!-- ══ LEFT: Image Gallery ══ -->
          <div class="relative sm:w-[48%] flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden" style="min-height: 260px; max-height: 420px;">

            <!-- Thumbnail strip -->
            ${y.length>1?`
              <div class="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 overflow-y-auto max-h-[200px] scrollbar-none">
                ${y.map((n,b)=>`
                  <button class="js-thumb w-10 h-10 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${b===0?"border-white shadow-lg scale-110":"border-transparent opacity-60 hover:opacity-90"}" data-index="${b}" onclick="window.modalSwitchImage(${b})">
                    <img src="${n}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </button>
                `).join("")}
              </div>
            `:""}

            <!-- Main image -->
            <div id="modal-main-img-wrap" class="w-full h-full" style="height:100%; min-height:inherit;">
              <img
                id="modal-main-img"
                src="${y[0]}"
                class="w-full h-full object-cover"
                style="min-height: inherit;"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000';"
              />
            </div>

            <!-- Close button -->
            <button id="close-product-modal" class="absolute top-4 right-4 z-30 bg-black/25 hover:bg-black/50 backdrop-blur-md p-2.5 rounded-full transition-all text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <!-- Discount badge -->
            ${r?`
              <div class="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-md">
                -${c}% OFF
              </div>
            `:""}
          </div>

          <!-- ══ RIGHT: Product Info ══ -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Scrollable content area -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">

              <!-- Category + Title + Price -->
              <div class="space-y-2">
                <span class="text-[10px] font-black text-lojaPrimaria uppercase tracking-[0.25em] opacity-80">
                  ${((f=e.categories)==null?void 0:f.name)||"Geral"}
                </span>
                <h2 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  ${e.name||e.title}
                </h2>
                <div class="flex items-baseline gap-3 pt-1">
                  <span class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                    ${d(s)}
                  </span>
                  ${r?`
                    <span class="text-sm text-gray-400 line-through font-bold">${d(e.price)}</span>
                    <span class="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-lg">
                      Economize ${d(Number(e.price)-Number(e.promo_price))}
                    </span>
                  `:""}
                </div>
                ${e.stock_quantity!==void 0?`
                  <div class="pt-1">
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-bold ${e.stock_quantity>0?"text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40":"text-red-500 bg-red-50 dark:bg-red-950/40"} px-2.5 py-1 rounded-full">
                      <span class="w-1.5 h-1.5 rounded-full ${e.stock_quantity>0?"bg-emerald-500":"bg-red-500"}"></span>
                      ${e.stock_quantity>0?`${e.stock_quantity} unidades em estoque`:"Esgotado"}
                    </span>
                  </div>
                `:""}
              </div>

              <!-- Description -->
              ${e.description?`
                <div class="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${e.description}</p>
                </div>
              `:""}

              <!-- Option 1: Colors / Adicionais / etc -->
              ${e.colors&&e.colors.length>0?`
                <div class="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${i}</span>
                    <span id="selected-color-label" class="text-[10px] font-black text-lojaPrimaria uppercase tracking-wider opacity-0 transition-opacity">—</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    ${e.colors.map(n=>`
                      <button class="js-color-btn group px-4 py-2 rounded-xl text-xs font-black border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
                                     hover:border-lojaPrimaria hover:text-lojaPrimaria transition-all active:scale-95 select-none" data-color="${n}">
                        ${n}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `:""}

              <!-- Option 2: Sizes / Bebidas / etc -->
              ${e.attributes&&e.attributes.length>0?`
                <div class="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${o}</span>
                    <span id="selected-attr-label" class="text-[10px] font-black text-lojaPrimaria uppercase tracking-wider opacity-0 transition-opacity">—</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    ${e.attributes.map(n=>`
                      <button class="js-attr-btn px-4 py-2 rounded-xl text-xs font-black border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
                                     hover:border-lojaPrimaria hover:text-lojaPrimaria transition-all active:scale-95 select-none" data-attr="${n}">
                        ${n}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `:""}

              <!-- Quantity Selector -->
              <div class="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2.5">
                <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Quantidade</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
                    <button id="qty-minus" class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-700 dark:text-gray-200 font-black text-lg leading-none">−</button>
                    <input type="number" id="qty-input" value="1" min="1" class="w-10 text-center font-black text-gray-900 dark:text-white bg-transparent focus:outline-none text-sm" readonly />
                    <button id="qty-plus" class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-xl transition text-gray-700 dark:text-gray-200 font-black text-lg leading-none">+</button>
                  </div>
                  <!-- Shipping info if available -->
                  ${Number(e.shipping_fee)>0?`
                    <span class="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2 5 5 3-3 5 5 2-2V9a1 1 0 00-1-1h-5" /></svg>
                      Frete: ${new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(e.shipping_fee)}
                    </span>
                  `:`<span class="text-[10px] text-emerald-500 font-black flex items-center gap-1">
                    ✓ Frete a combinar
                  </span>`}
                </div>
              </div>
            </div>

            <!-- ══ Fixed Action Footer ══ -->
            <div class="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 space-y-2.5 flex-shrink-0">
              <button id="modal-add-to-cart"
                class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-xl shadow-lojaPrimaria/25
                       hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-widest
                       flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Adicionar ao Carrinho
              </button>
              <button id="buy-now-whatsapp"
                class="w-full bg-[#25D366] text-white font-black py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.2em]
                       flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.38-1.644-1.541-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/></svg>
                Pedir pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    `},bindEvents(e,t,i,o={}){const r=o.opt1Label||"Opções",s=o.opt2Label||"Variações",c=e.querySelector("#product-modal-root"),d=e.querySelector("#close-product-modal"),y=e.querySelector("#modal-backdrop"),f=e.querySelector("#qty-input"),n=e.querySelector("#qty-plus"),b=e.querySelector("#qty-minus"),x=e.querySelector("#modal-add-to-cart"),u=e.querySelector("#buy-now-whatsapp");let h=null,k=null;window.modalSwitchImage=l=>{const a=e.querySelector("#modal-main-img"),g=e.querySelectorAll(".js-thumb"),m=[];t.image_url&&m.push(t.image_url),Array.isArray(t.image_urls)&&t.image_urls.forEach(v=>{v&&!m.includes(v)&&m.push(v)}),a&&m[l]&&(a.style.opacity="0",a.style.transition="opacity 0.2s",setTimeout(()=>{a.src=m[l],a.style.opacity="1"},200)),g.forEach((v,_)=>{v.classList.toggle("border-white",_===l),v.classList.toggle("scale-110",_===l),v.classList.toggle("opacity-60",_!==l),v.classList.toggle("border-transparent",_!==l)})};const p=()=>{c==null||c.classList.add("animate-out","fade-out","zoom-out","duration-200"),setTimeout(()=>c==null?void 0:c.remove(),200)};d==null||d.addEventListener("click",p),y==null||y.addEventListener("click",l=>{l.target===y&&p()}),document.addEventListener("keydown",function l(a){a.key==="Escape"&&(p(),document.removeEventListener("keydown",l))}),n==null||n.addEventListener("click",()=>{f.value=parseInt(f.value)+1}),b==null||b.addEventListener("click",()=>{parseInt(f.value)>1&&(f.value=parseInt(f.value)-1)}),e.querySelectorAll(".js-color-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".js-color-btn").forEach(g=>{g.classList.remove("bg-lojaPrimaria","text-white","border-lojaPrimaria"),g.classList.add("border-gray-200","dark:border-gray-700","text-gray-600")}),l.classList.remove("border-gray-200","dark:border-gray-700","text-gray-600"),l.classList.add("bg-lojaPrimaria","text-white","border-lojaPrimaria"),k=l.getAttribute("data-color");const a=e.querySelector("#selected-color-label");a&&(a.textContent=k,a.classList.remove("opacity-0"))})}),e.querySelectorAll(".js-attr-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".js-attr-btn").forEach(g=>{g.classList.remove("bg-lojaPrimaria","text-white","border-lojaPrimaria"),g.classList.add("border-gray-200","dark:border-gray-700","text-gray-600")}),l.classList.remove("border-gray-200","dark:border-gray-700","text-gray-600"),l.classList.add("bg-lojaPrimaria","text-white","border-lojaPrimaria"),h=l.getAttribute("data-attr");const a=e.querySelector("#selected-attr-label");a&&(a.textContent=h,a.classList.remove("opacity-0"))})}),x==null||x.addEventListener("click",()=>{var l,a,g,m;if(((l=t.colors)==null?void 0:l.length)>0&&!k){S.show(`Selecione ${r.toLowerCase()} para continuar`,"error"),(a=e.querySelectorAll(".js-color-btn")[0])==null||a.classList.add("ring-2","ring-red-400");return}if(((g=t.attributes)==null?void 0:g.length)>0&&!h){S.show(`Selecione ${s.toLowerCase()} para continuar`,"error"),(m=e.querySelectorAll(".js-attr-btn")[0])==null||m.classList.add("ring-2","ring-red-400");return}i({quantity:parseInt(f.value),size:h,color:k,option1:k,option2:h}),S.show("Produto adicionado ao carrinho! 🛒"),p()}),u==null||u.addEventListener("click",()=>{const l=P.getState().tenant,g=((l==null?void 0:l.whatsapp_number)||"5511999999999").replace(/\D/g,""),v=[`Olá! Tenho interesse no produto: *${t.name||t.title||"Produto"}*`];k&&v.push(`${r}: ${k}`),h&&v.push(`${s}: ${h}`),v.push(`Quantidade: ${f.value}`);const _=v.join(`
`);window.open(`https://wa.me/${g}?text=${encodeURIComponent(_)}`,"_blank")})}},W=[{id:1,name:"Eletrônicos & Tech",description:"Gadgets de última geração, áudio de alta fidelidade e tecnologia para o dia a dia."},{id:2,name:"Moda & Vestuário",description:"Roupas modernas, tecidos premium e peças essenciais para o seu estilo."},{id:3,name:"Calçados & Sneakers",description:"Tênis urbanos, casuais e esportivos com design exclusivo e máximo conforto."},{id:4,name:"Acessórios & Estilo",description:"Relógios, mochilas e óculos para complementar seu visual em qualquer ocasião."},{id:5,name:"Casa & Decoração",description:"Itens minimalistas e funcionais para transformar o seu ambiente de trabalho ou casa."}],te=[{id:1,category_id:1,name:"Headphone Bluetooth Noise Cancelling Pro",description:"Cancelamento ativo de ruído híbrido, drivers de 40mm de titânio e autonomia de até 35 horas de reprodução contínua.",price:489.9,promo_price:399.9,image_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",stock_quantity:18,is_active:!0},{id:2,category_id:1,name:"Smartwatch AMOLED Ultra Fit",description:'Tela Always-on AMOLED de 1.43", monitoramento cardíaco contínuo, GPS integrado e resistência à água de 5ATM.',price:359,promo_price:299,image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",stock_quantity:25,is_active:!0},{id:3,category_id:1,name:"Teclado Mecânico Wireless RGB Compact",description:"Switches táteis hot-swappable, conectividade Tri-Mode (Bluetooth, 2.4GHz e USB-C) e iluminação RGB programável.",price:320,promo_price:null,image_url:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",stock_quantity:12,is_active:!0},{id:4,category_id:1,name:"Caixa de Som Portátil Waterproof 30W",description:"Som envolvente de 360 graus, graves potentes com radiadores passivos duplos e certificação IPX7 à prova dágua.",price:229.9,promo_price:189.9,image_url:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",stock_quantity:30,is_active:!0},{id:5,category_id:2,name:"Camiseta Oversized Minimalist Algodão Egípcio",description:"Modelagem boxy moderna, 100% algodão penteado de alta gramatura (240g) com toque super macio e caimento impecável.",price:119.9,promo_price:89.9,image_url:"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",stock_quantity:45,is_active:!0},{id:6,category_id:2,name:"Jaqueta Corta-Vento Urban Techwear",description:"Tecido impermeável e corta-vento com detalhes refletivos, capuz ergonômico ajustável e bolsos selados térmicos.",price:279,promo_price:239,image_url:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",stock_quantity:15,is_active:!0},{id:7,category_id:2,name:"Moletom Hoodie Heavyweight Essential",description:"Interior felpado ultra quente, costuras reforçadas pespontadas e corte unissex premium para dias mais frios.",price:199.9,promo_price:null,image_url:"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",stock_quantity:20,is_active:!0},{id:8,category_id:3,name:"Sneaker Retro Runner Casual Branco & Vermelho",description:"Inspirado nos clássicos do street style dos anos 90, com entressola em EVA macio e cabedal de couro legítimo camurçado.",price:389.9,promo_price:329.9,image_url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",stock_quantity:14,is_active:!0},{id:9,category_id:3,name:"Tênis Running Performance CloudFly",description:"Amortecimento responsivo de alta absorção de impacto, cabedal em malha respirável knit sem costuras.",price:449,promo_price:379,image_url:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",stock_quantity:22,is_active:!0},{id:10,category_id:3,name:"Bota Coturno Couro Legitimo Urban Black",description:"Solado tratorado em borracha antiderrapante com vira costurada Goodyear welted para máxima durabilidade.",price:349.9,promo_price:null,image_url:"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",stock_quantity:10,is_active:!0},{id:11,category_id:4,name:"Mochila Impermeável SafeRoll 25L",description:'Compartimento acolchoado para notebook de até 16", zíperes anti-furto selados e tecido resistente à abrasão.',price:249.9,promo_price:199.9,image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",stock_quantity:16,is_active:!0},{id:12,category_id:4,name:"Óculos de Sol Acetato Polarizado Classic",description:"Lentes com 100% de proteção UV400, armação artesanal em acetato preto fosco e dobradiças reforçadas de metal.",price:169.9,promo_price:139.9,image_url:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",stock_quantity:28,is_active:!0},{id:13,category_id:4,name:"Relógio Minimalista Cronógrafo All-Black",description:"Mecanismo quartzo japonês de precisão, pulseira de aço inoxidável em malha milanesa e vidro safira resistente a riscos.",price:289,promo_price:null,image_url:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",stock_quantity:15,is_active:!0},{id:14,category_id:5,name:"Luminária de Mesa Articulada LED Smart",description:"Controle touch de temperatura de cor (quente, neutra, fria) e dimerização gradual com porta de carregamento USB integrada.",price:159.9,promo_price:129.9,image_url:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",stock_quantity:20,is_active:!0},{id:15,category_id:5,name:"Garrafa Térmica Inox Vacuum 750ml",description:"Isolamento térmico à vácuo de parede dupla que mantém bebidas geladas por 24h e quentes por 12h sem condensação externa.",price:89.9,promo_price:69.9,image_url:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",stock_quantity:40,is_active:!0}],R={async getCategories(){try{}catch{}return W},async getProducts({categoryId:e=null,searchQuery:t="",orderBy:i="featured"}={}){let o=null;if(!o)try{}catch{}if(o||(o=te.map(r=>{const s=W.find(c=>c.id===r.category_id);return{...r,title:r.name,categories:{name:s?s.name:"Geral"}}})),e&&(o=o.filter(r=>String(r.category_id)===String(e))),t){const r=t.toLowerCase();o=o.filter(s=>s.name&&s.name.toLowerCase().includes(r)||s.title&&s.title.toLowerCase().includes(r)||s.description&&s.description.toLowerCase().includes(r))}return i==="asc"?o.sort((r,s)=>Number(r.price)-Number(s.price)):i==="desc"&&o.sort((r,s)=>Number(s.price)-Number(r.price)),o},async getProductById(e){return(await this.getProducts()).find(i=>String(i.id)===String(e))||null}},z={async getProducts({categoryId:e,searchQuery:t,orderBy:i="featured"}={}){return await R.getProducts({categoryId:e,searchQuery:t,orderBy:i})},async getById(e){return await R.getProductById(e)}},Z={async getAllActive(){try{return await R.getCategories()||[]}catch(e){return console.error("Erro no categoryService.getAllActive:",e.message),[]}}},X={selectedCategoryId:null,searchQuery:"",allProducts:[],categories:[],tenant:null,async render(){try{const t=new URLSearchParams(window.location.search).get("store");let i=null;try{}catch{}const o=i||{store_name:"Catálogo Pro",hero_title:"Catálogo Digital & Delivery",hero_subtitle:"Explore produtos exclusivos e finalize seu pedido diretamente pelo WhatsApp",hero_image_url:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",whatsapp_number:"5511999999999",primary_color:"#3b82f6",secondary_color:"#1e3a8a",address:"São Paulo, SP - Atendimento Online"},[r,s]=await Promise.all([z.getProducts(),Z.getAllActive()]);this.allProducts=r||[],this.categories=s||[],this.tenant=o;const c=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),d=o.hero_image_url?`style="background: linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('${o.hero_image_url}'); background-size: cover; background-position: center;"`:'class="bg-gradient-to-br from-lojaPrimaria to-lojaSecundaria"',f=`
        <a href="https://wa.me/${(o.whatsapp_number||"5511999999999").replace(/\D/g,"")}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20cat%C3%A1logo." target="_blank" class="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.644-1.921-.154-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/>
          </svg>
          <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">Fale Conosco</span>
        </a>
      `;return`
        <!-- HERO BANNER -->
        <section class="relative w-full h-[360px] md:h-[460px] flex items-center justify-center text-center px-4" ${d.startsWith("style")?d:""} ${d.startsWith("class")?d:""}>
          <div class="max-w-4xl mx-auto space-y-4 relative z-10 text-white animate-in fade-in slide-in-from-bottom duration-700">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Vitrine Online • Catálogo Interativo
            </div>
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              ${o.hero_title||"Catálogo Pro"}
            </h1>
            <p class="text-sm md:text-lg font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
              ${o.hero_subtitle||"Escolha seus itens favoritos e finalize sua compra facilmente."}
            </p>
          </div>
        </section>

        <!-- CONTEÚDO PRINCIPAL -->
        <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
          
          <!-- BARRA DE PESQUISA -->
          <section class="relative max-w-2xl mx-auto">
            <div class="relative group">
              <input
                type="text"
                id="search-input"
                placeholder="Buscar por nome ou descrição do produto..."
                class="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white focus:border-lojaPrimaria focus:ring-4 focus:ring-lojaPrimaria/10 transition outline-none shadow-sm"
                value="${this.searchQuery}"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-lojaPrimaria transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </section>

          <!-- CATEGORIAS STICKY -->
          <section class="sticky top-[73px] z-30 -mx-4 px-4 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 scrollbar-none overflow-x-auto">
            <div class="flex gap-2.5 max-w-7xl mx-auto">
              <button data-category-id="all" class="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${this.selectedCategoryId?"bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300":"bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20"}">
                🔥 Todos (${this.allProducts.length})
              </button>
              ${this.categories.map(n=>{const b=this.allProducts.filter(u=>String(u.category_id)===String(n.id)).length,x=String(this.selectedCategoryId)===String(n.id);return`
                  <button data-category-id="${n.id}" class="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${x?"bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20":"bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}">
                    ${n.name} ${b>0?`(${b})`:""}
                  </button>
                `}).join("")}
            </div>
          </section>

          <!-- GRID DE PRODUTOS -->
          <section id="products-grid-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
            ${this.renderProductsHTML(this.allProducts,c)}
          </section>
        </main>

        <!-- RODAPÉ MODERNO -->
        <footer class="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-12 pb-20 mt-16">
          <div class="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div class="space-y-2">
              <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">${o.store_name}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto font-medium">
                Catálogo digital otimizado de alta performance integrado ao PostgreSQL Neon e WhatsApp.
              </p>
            </div>

            ${o.address?`
              <div class="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${o.address}</span>
              </div>
            `:""}

            <div class="flex items-center justify-center gap-6 text-xs font-black text-gray-400 uppercase tracking-widest pt-2">
              <a href="#" class="hover:text-lojaPrimaria transition">Início</a>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <a href="/?page=admin" class="hover:text-lojaPrimaria transition">Painel Admin</a>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              © ${new Date().getFullYear()} ${o.store_name} • Desenvolvido para Portfólio
            </div>
          </div>
        </footer>

        <!-- BOTÃO WHATSAPP FLUTUANTE -->
        ${f}
      `}catch(e){return console.error("Erro ao renderizar Home:",e),`
        <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">Ops! Algo deu errado ao carregar o catálogo.</h2>
          <p class="text-gray-500 mt-2">${e.message}</p>
          <button onclick="location.reload()" class="mt-6 bg-lojaPrimaria text-white px-8 py-3 rounded-2xl font-bold shadow-lg">Tentar Novamente</button>
        </div>
      `}},renderProductsHTML(e,t){let i=e;if(this.selectedCategoryId&&(i=i.filter(o=>String(o.category_id)===String(this.selectedCategoryId))),this.searchQuery){const o=this.searchQuery.toLowerCase().trim();i=i.filter(r=>{const s=(r.name||r.title||"").toLowerCase(),c=(r.description||"").toLowerCase();return s.includes(o)||c.includes(o)})}return i.length===0?`
        <div class="col-span-full py-20 text-center space-y-4">
          <div class="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200">Nenhum produto encontrado</h4>
          <p class="text-gray-500 text-xs">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      `:i.map(o=>{var b;const r=o.name||o.title||"Produto",s=Number(o.price),c=o.promo_price?Number(o.promo_price):null,d=c&&c<s,y=d?Math.round((s-c)/s*100):0,f=d?c:s,n=o.stock_quantity!==void 0&&o.stock_quantity<=0;return`
        <div class="js-product-card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full relative animate-in fade-in" data-id="${o.id}">

          ${d?`
            <span class="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md z-10 shadow-sm flex items-center gap-0.5 leading-none">
              <span>-${y}%</span>
              <span class="text-[7px] opacity-80">OFF</span>
            </span>
          `:""}

          ${n?`
            <span class="absolute top-2.5 right-2.5 bg-gray-900/80 backdrop-blur-sm text-white text-[8px] font-black uppercase px-2 py-1 rounded-md z-10">
              Esgotado
            </span>
          `:""}

          <div class="aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            <img
              src="${o.image_url||"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="${r}"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';"
            />
          </div>

          <div class="p-3.5 md:p-4 flex flex-col flex-grow">
            <span class="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
              ${((b=o.categories)==null?void 0:b.name)||"Geral"}
            </span>
            <h3 class="font-bold text-gray-800 dark:text-white text-xs md:text-sm line-clamp-2 mb-2 flex-grow leading-snug">
              ${r}
            </h3>
            
            <div class="flex flex-col mt-auto pt-2">
              <div class="flex items-baseline gap-1.5 flex-wrap">
                ${d?`<span class="text-[10px] text-gray-400 line-through">R$ ${s.toFixed(2)}</span>`:""}
                <span class="text-sm md:text-lg font-black ${d?"text-red-600":"text-gray-900 dark:text-white"}">
                  ${t(f)}
                </span>
              </div>
              <button class="js-quick-add mt-2.5 w-full bg-gray-900 dark:bg-gray-700 hover:bg-lojaPrimaria dark:hover:bg-lojaPrimaria text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      `}).join("")},bindEvents(e){const t=o=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(o),i=e.querySelector("#search-input");i&&(i.oninput=o=>{this.searchQuery=o.target.value;const r=e.querySelector("#products-grid-container");r&&(r.innerHTML=this.renderProductsHTML(this.allProducts,t),this.bindCardEvents(e))}),e.querySelectorAll(".js-category-btn").forEach(o=>{o.onclick=()=>{const r=o.dataset.categoryId;this.selectedCategoryId=r==="all"?null:r,e.querySelectorAll(".js-category-btn").forEach(c=>{c.className="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}),o.className="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20";const s=e.querySelector("#products-grid-container");s&&(s.innerHTML=this.renderProductsHTML(this.allProducts,t),this.bindCardEvents(e))}}),this.bindCardEvents(e)},bindCardEvents(e){e.querySelectorAll(".js-product-card").forEach(t=>{t.onclick=i=>{if(i.target.closest(".js-quick-add"))return;const o=t.dataset.id,r=this.allProducts.find(c=>String(c.id)===String(o)),s=document.getElementById("product-modal-container");s&&r&&(s.innerHTML=G.render(r),G.bindEvents(s,r,c=>{window.dispatchEvent(new CustomEvent("global:add-to-cart",{detail:{id:r.id,...c}}))}))}}),e.querySelectorAll(".js-quick-add").forEach(t=>{t.onclick=i=>{i.stopPropagation();const o=t.closest(".js-product-card");o&&o.dataset.id&&(window.dispatchEvent(new CustomEvent("global:add-to-cart",{detail:{id:o.dataset.id}})),S.show("Produto adicionado ao carrinho! 🛒"))}})}},J={async render(){try{const{data:e,error:t}=await w.from("tenant_settings").select("id, store_name, slug, logo_url, hero_image_url, hero_title, hero_subtitle, whatsapp_number, primary_color").order("store_name",{ascending:!0});if(t)throw t;const i=e||[];return`
        <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">

          <!-- Hero Header -->
          <header class="relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-transparent to-transparent pointer-events-none"></div>
            <div class="max-w-6xl mx-auto px-6 pt-16 pb-20 relative z-10 text-center">
              <div class="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-8">
                <span class="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>
                Plataforma Multi-Nicho
              </div>
              <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                Catálogo
                <span class="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pro</span>
              </h1>
              <p class="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                Descubra os melhores catálogos digitais e conclua suas compras diretamente no WhatsApp.
              </p>

              <div class="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                <a href="/?page=admin" class="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-violet-900/50 hover:scale-[1.02] active:scale-[0.98]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Painel Administrativo
                </a>
                <a href="#lojas" class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all">
                  Ver todas as lojas
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                </a>
              </div>
            </div>
          </header>

          <!-- Stats Bar -->
          <div class="border-y border-white/5 bg-white/[0.02] py-6">
            <div class="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
              <div>
                <p class="text-3xl font-black text-white">${i.length}</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Lojas Ativas</p>
              </div>
              <div>
                <p class="text-3xl font-black text-white">Multi</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Nichos</p>
              </div>
              <div>
                <p class="text-3xl font-black text-white">WhatsApp</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Checkout</p>
              </div>
            </div>
          </div>

          <!-- Store Listing -->
          <main id="lojas" class="max-w-6xl mx-auto px-6 py-16">
            <!-- Search -->
            <div class="mb-10 max-w-md">
              <div class="relative">
                <input
                  type="text"
                  id="portal-search"
                  placeholder="Buscar loja..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/10 transition"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div id="portal-stores-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${this.renderStores(i)}
            </div>

            ${i.length===0?`
              <div class="text-center py-24 space-y-4">
                <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-4xl">🏪</div>
                <h3 class="text-xl font-black text-gray-300">Nenhuma loja cadastrada ainda</h3>
                <p class="text-gray-600 text-sm">Acesse o painel de Super Admin para adicionar a primeira loja.</p>
                <a href="/?page=admin" class="inline-block mt-4 bg-violet-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-violet-500 transition">
                  Acessar Painel
                </a>
              </div>
            `:""}
          </main>

          <!-- Footer -->
          <footer class="border-t border-white/5 py-10 text-center">
            <p class="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">© 2026 CatálogoPro · Plataforma SaaS Multi-Nicho</p>
          </footer>
        </div>
      `}catch(e){return console.error("Erro ao carregar portal:",e),`
        <div class="min-h-screen flex items-center justify-center bg-gray-950 text-white">
          <div class="text-center p-8 space-y-4">
            <h2 class="text-2xl font-black">Erro ao carregar o portal</h2>
            <p class="text-gray-500">${e.message}</p>
            <button onclick="location.reload()" class="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold">Tentar novamente</button>
          </div>
        </div>
      `}},renderStores(e){return e.length?e.map(t=>{const i=t.slug||t.id,o=t.hero_image_url?`style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${t.hero_image_url}'); background-size: cover; background-position: center;"`:`style="background: linear-gradient(135deg, ${t.primary_color||"#6d28d9"}33, ${t.primary_color||"#6d28d9"}11);"`;return`
        <a href="/?store=${i}" class="js-store-card group relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-900/30 block" data-name="${(t.store_name||"").toLowerCase()}">
          <div class="h-52 flex flex-col justify-between p-6" ${o}>
            <div class="flex items-start justify-between">
              ${t.logo_url?`<img src="${t.logo_url}" class="h-12 w-12 rounded-2xl object-cover border-2 border-white/20 shadow-lg" onerror="this.style.display='none'" />`:`<div class="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white" style="background:${t.primary_color||"#6d28d9"}44">${(t.store_name||"?").charAt(0).toUpperCase()}</div>`}
              <span class="text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/10">
                Aberta
              </span>
            </div>
            <div>
              <h3 class="text-lg font-black text-white leading-tight group-hover:text-violet-200 transition">${t.store_name||i}</h3>
              ${t.hero_subtitle?`<p class="text-xs text-white/60 mt-1 line-clamp-1">${t.hero_subtitle}</p>`:""}
            </div>
          </div>
          <div class="bg-white/[0.03] border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">/${i}</span>
            <span class="text-[10px] font-black text-violet-400 uppercase tracking-widest group-hover:text-violet-300 flex items-center gap-1 transition">
              Visitar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </a>
      `}).join(""):""},bindEvents(e){const t=e.querySelector("#portal-search");t&&(t.oninput=i=>{const o=i.target.value.toLowerCase().trim();e.querySelectorAll(".js-store-card").forEach(r=>{const s=r.dataset.name||"";r.style.display=s.includes(o)?"":"none"})})}},M={isOpen:!1,render(){const{cart:e,tenant:t}=P.getState(),i=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),o=e.reduce((n,b)=>{const x=b.product.promo_price&&b.product.promo_price<b.product.price?b.product.promo_price:b.product.price;return n+x*b.quantity},0),r=t!=null&&t.delivery_fee?Number(t.delivery_fee):0,s=e.reduce((n,b)=>{var u;const x=Number(((u=b.product)==null?void 0:u.shipping_fee)||0);return x>n?x:n},0),c=s>0?s:r,d=o+c,y=this.isOpen?"":"hidden opacity-0",f=this.isOpen?"translate-x-0":"translate-x-full";return`
      <div id="cart-overlay" class="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${y}">
        <div id="cart-panel" class="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${f}">
          
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-lojaPrimaria/10 rounded-xl flex items-center justify-center text-lojaPrimaria">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-tight">Carrinho</h2>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${e.length} itens selecionados</p>
              </div>
            </div>
            <button id="close-cart" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex-grow overflow-y-auto p-4 space-y-4">
            ${e.length===0?`
              <div class="h-full flex flex-col items-center justify-center text-center p-8">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <h3 class="text-gray-900 font-bold">Carrinho vazio</h3>
                <p class="text-gray-400 text-xs mt-1">Explore nossa vitrine e adicione seus produtos favoritos aqui.</p>
              </div>
            `:e.map(n=>{const b=n.product.promo_price&&n.product.promo_price<n.product.price?n.product.promo_price:n.product.price,x=Object.entries(n.selectedAttributes).map(([u,h])=>`${u}: ${h}`).join(", ");return`
                  <div class="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-50">
                      <img src="${n.product.image_url||""}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100'" />
                    </div>
                    <div class="flex-grow flex flex-col justify-between py-0.5">
                      <div>
                        <h4 class="text-sm font-bold text-gray-900 line-clamp-1">${n.product.name||n.product.title}</h4>
                        ${x?`<p class="text-[10px] text-lojaPrimaria font-black uppercase tracking-widest mt-1">${x}</p>`:""}
                      </div>
                      <div class="flex justify-between items-center mt-2">
                        <span class="text-sm font-black text-gray-900">${i(b*n.quantity)}</span>
                        <div class="flex items-center bg-gray-100 rounded-lg p-1">
                          <button data-id="${n.cartItemId}" class="js-cart-dec w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold transition">-</button>
                          <span class="w-8 text-center text-xs font-bold text-gray-900">${n.quantity}</span>
                          <button data-id="${n.cartItemId}" class="js-cart-inc w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold transition">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                `}).join("")}
          </div>

          ${e.length>0?`
            <div class="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span class="text-gray-900">${i(o)}</span>
                </div>
                <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Entrega</span>
                  <span class="text-green-600">${c===0?"Grátis":i(c)}</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span class="text-lg font-black text-gray-900 uppercase tracking-tight">Total</span>
                  <span class="text-xl font-black text-lojaPrimaria">${i(d)}</span>
                </div>
              </div>
              
              <button id="go-to-checkout" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg shadow-lojaPrimaria/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
                Finalizar Pedido
              </button>
            </div>
          `:""}

        </div>
      </div>
    `},open(){this.isOpen=!0;const e=document.getElementById("cart-overlay"),t=document.getElementById("cart-panel");!e||!t||(e.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),t.classList.remove("translate-x-full")},10))},close(){this.isOpen=!1;const e=document.getElementById("cart-overlay"),t=document.getElementById("cart-panel");!e||!t||(e.classList.add("opacity-0"),t.classList.add("translate-x-full"),setTimeout(()=>e.classList.add("hidden"),300))},bindEvents(e,t){const i=e.querySelector("#close-cart"),o=e.querySelector("#cart-overlay"),r=e.querySelector("#cart-panel"),s=e.querySelector("#go-to-checkout");i&&(i.onclick=()=>this.close()),o&&(o.onclick=c=>{c.target.id==="cart-overlay"&&this.close()}),r&&(r.onclick=c=>c.stopPropagation()),s&&t&&(s.onclick=()=>{this.close(),t()}),e.querySelectorAll(".js-cart-inc").forEach(c=>{c.onclick=d=>{d.stopPropagation();const y=c.getAttribute("data-id"),{cart:f}=P.getState(),n=f.find(b=>b.cartItemId===y);n&&P.addToCart(n.product,1,n.selectedAttributes)}}),e.querySelectorAll(".js-cart-dec").forEach(c=>{c.onclick=d=>{d.stopPropagation();const y=c.getAttribute("data-id"),{cart:f}=P.getState(),n=f.find(b=>b.cartItemId===y);n&&(n.quantity>1?P.addToCart(n.product,-1,n.selectedAttributes):P.removeFromCart(y))}})}},O={render(){const{cart:e,tenant:t}=P.getState(),i=f=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(f),o=t!=null&&t.delivery_fee?parseFloat(t.delivery_fee):0,r=e.reduce((f,n)=>{var x;const b=parseFloat(((x=n.product)==null?void 0:x.shipping_fee)||0);return b>f?b:f},0),s=r>0?r:o,c=e.reduce((f,n)=>{const b=n.product||{},x=b.promo_price&&b.promo_price<b.price?Number(b.promo_price):Number(b.price||0),u=Number(n.quantity)||1;return f+x*u},0),d=c+s,y=s>0?i(s):'<span class="text-green-600 font-extrabold">A combinar / Grátis 💬</span>';return`
      <div id="checkout-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
          
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="text-lg font-bold text-gray-900">Finalizar no WhatsApp</h3>
            <button id="close-checkout" class="text-gray-400 hover:text-gray-600 font-bold">&#x2715;</button>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100 text-sm">
            <h4 class="font-bold text-gray-700 uppercase text-xs tracking-wider mb-1">Resumo do Pedido</h4>
            <div class="flex justify-between text-gray-600">
              <span>Subtotal dos itens:</span>
              <span class="font-medium text-gray-800">${i(c)}</span>
            </div>
            <div class="flex justify-between text-gray-600 items-center">
              <span>Taxa de Entrega:</span>
              <span class="font-medium text-gray-800">${y}</span>
            </div>
            <div class="flex justify-between text-base font-black text-gray-900 border-t pt-2 mt-1">
              <span>Total Geral:</span>
              <span>${i(d)}</span>
            </div>
          </div>
          
          <form id="checkout-form" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Seu Nome *</label>
              <input type="text" id="form-name" required class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-lojaPrimaria focus:outline-none" placeholder="Ex: João Silva" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">WhatsApp de Contato *</label>
              <input type="tel" id="form-phone" required class="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-lojaPrimaria focus:outline-none" placeholder="Ex: 11999999999" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Endereço de Entrega *</label>
              <textarea id="form-address" required class="w-full border border-gray-200 rounded-lg p-2.5 text-sm h-16 focus:ring-2 focus:ring-lojaPrimaria focus:outline-none" placeholder="Rua, número, bairro"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Forma de Pagamento *</label>
              <select id="form-payment" required class="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-lojaPrimaria focus:outline-none">
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito/Débito">Cartão de Crédito/Débito</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm mt-4">
              Confirmar e Enviar para WhatsApp
            </button>
          </form>
        </div>
      </div>
    `},open(){var t;const e=document.getElementById("checkout-modal-container");e&&(e.innerHTML=this.render(),this.bindEvents(e,window.currentCheckoutCallback||(()=>{}))),(t=document.getElementById("checkout-modal"))==null||t.classList.remove("hidden")},close(){var e;(e=document.getElementById("checkout-modal"))==null||e.classList.add("hidden")},bindEvents(e,t){const i=e.querySelector("#close-checkout"),o=e.querySelector("#checkout-form");window.currentCheckoutCallback=t,i&&(i.onclick=()=>this.close()),o&&(o.onsubmit=r=>{r.preventDefault();const s={customerName:e.querySelector("#form-name").value,customerPhone:e.querySelector("#form-phone").value,deliveryAddress:e.querySelector("#form-address").value,paymentMethod:e.querySelector("#form-payment").value};t(s)})}},re={async createOrder({customerName:e,customerPhone:t,deliveryAddress:i,paymentMethod:o,cartItems:r,tenant:s}){try{const c=l=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(l),d=s!=null&&s.delivery_fee?Number(s.delivery_fee):0,y=r.reduce((l,a)=>{var m;const g=a.shipping_fee??((m=a.product)==null?void 0:m.shipping_fee)??0;return g>l?g:l},0),f=y>0?y:d,n=r.reduce((l,a)=>{const g=a.product||a,m=g.promo_price&&Number(g.promo_price)<Number(g.price)?Number(g.promo_price):Number(g.price||0);return l+m*a.quantity},0),b=n+f;let x="ORD-"+Date.now();try{}catch(l){console.warn("Persistência opcional de pedido não concluída (tabelas orders podem não existir):",l.message)}let u=`*📦 NOVO PEDIDO RECEBIDO (#${x})*
`;u+=`----------------------------------------
`,u+=`*Cliente:* ${e}
`,u+=`*Telefone:* ${t}
`,u+=`----------------------------------------
`,u+=`*🛒 ITENS DO PEDIDO:*
`,r.forEach(l=>{var v,_;const a=l.product||l,g=a.name||a.title||"Produto",m=a.promo_price&&Number(a.promo_price)<Number(a.price)?Number(a.promo_price):Number(a.price||0);u+=`${l.quantity}x ${g} - ${c(m)}
`,(v=l.selectedAttributes)!=null&&v.size&&(u+=`- Tamanho/Opção: ${l.selectedAttributes.size}
`),(_=l.selectedAttributes)!=null&&_.color&&(u+=`- Cor/Variação: ${l.selectedAttributes.color}
`)}),u+=`----------------------------------------
`,u+=`*💰 RESUMO DOS VALORES:*
`,u+=`Subtotal: ${c(n)}
`,u+=`Taxa de Entrega: ${f===0?"Grátis / A combinar":c(f)}
`,u+=`*TOTAL DO PEDIDO: ${c(b)}*
`,u+=`----------------------------------------
`,u+=`*📍 DADOS DE ENTREGA / PAGAMENTO:*
`,u+=`Forma de Pagamento: ${o}
`,u+=`Tipo: ${i?"Delivery":"Retirada"}
`,u+=`Endereço: ${i||"Retirada no Local"}
`;const p=`https://wa.me/${((s==null?void 0:s.whatsapp_number)||"5511999999999").replace(/\D/g,"")}?text=${encodeURIComponent(u)}`;return window.open(p,"_blank"),S.show("Pedido gerado com sucesso! Redirecionando para o WhatsApp... 🚀"),{success:!0,orderId:x}}catch(c){return console.error("Erro ao gerar pedido:",c),S.show("Erro ao processar pedido.","error"),{success:!1}}}},T={render(e,t="",i="Carregar Imagem"){return`
      <div class="space-y-2" id="container-${e}">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">${i}</label>
        <div class="flex items-center gap-4">
          <div class="relative w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group">
            ${t?`<img src="${t}" id="preview-${e}" class="w-full h-full object-cover" />`:`<div id="placeholder-${e}" class="text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                 </div>`}
            <div id="loading-${e}" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
            </div>
          </div>
          <div class="flex-grow space-y-2">
            <input type="file" id="input-${e}" accept="image/*" class="hidden" />
            <button type="button" onclick="document.getElementById('input-${e}').click()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 px-4 rounded-lg transition">
              Selecionar Arquivo
            </button>

            <div id="progress-container-${e}" class="hidden w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
               <div id="progress-bar-${e}" class="bg-lojaPrimaria h-full w-0 transition-all duration-300"></div>
            </div>

            <p class="text-[10px] text-gray-400 mt-1">PNG, JPG ou WEBP. Auto-compressão ativa.</p>
            <input type="hidden" id="url-${e}" value="${t}" />
          </div>
        </div>
      </div>
    `},async compressImage(e){return new Promise(t=>{const i=new FileReader;i.readAsDataURL(e),i.onload=o=>{const r=new Image;r.src=o.target.result,r.onload=()=>{const s=document.createElement("canvas"),c=1080;let d=r.width,y=r.height;d>c&&(y=Math.round(y*c/d),d=c),s.width=d,s.height=y,s.getContext("2d").drawImage(r,0,0,d,y),s.toBlob(n=>{t(n)},"image/jpeg",.75)}}})},bindEvents(e,t){const i=document.getElementById(`input-${e}`),o=document.getElementById(`loading-${e}`),r=document.getElementById(`container-${e}`).querySelector(".relative"),s=document.getElementById(`url-${e}`),c=document.getElementById(`progress-container-${e}`),d=document.getElementById(`progress-bar-${e}`);i&&(i.onchange=async y=>{const f=y.target.files[0];if(f){o.classList.remove("hidden"),o.classList.add("flex"),c.classList.remove("hidden"),d.style.width="20%";try{const n=await this.compressImage(f);d.style.width="50%";const x=`uploads/${`${Math.random().toString(36).substring(2)}.jpg`}`,{error:u}=await w.storage.from("loja").upload(x,n);if(u)throw u;d.style.width="100%";const{data:{publicUrl:h}}=w.storage.from("loja").getPublicUrl(x);s.value=h,r.innerHTML=`
            <img src="${h}" id="preview-${e}" class="w-full h-full object-cover" />
            <div id="loading-${e}" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
            </div>
          `,t&&t(h)}catch(n){console.error("Erro no upload:",n.message),S.show("Erro ao carregar imagem: "+n.message,"error")}finally{o.classList.add("hidden"),o.classList.remove("flex"),setTimeout(()=>{c.classList.add("hidden"),d.style.width="0%"},1e3)}}})}},Q={async render(){try{window.currentAdminTab=window.currentAdminTab||"overview";const t=null||P.getState().tenant||{store_name:"Catálogo Pro",logo_url:null,whatsapp_number:"5511999999999",primary_color:"#3b82f6",secondary_color:"#1e3a8a"},i=t.option1_label||"Cores",o=t.option2_label||"Tamanhos",r=!0,[s,c]=await Promise.all([z.getProducts(),Z.getAllActive()]);let d=[];d.length===0&&(d=[{id:"101",customer_name:"Lucas Ferreira",customer_phone:"(11) 98765-4321",delivery_address:"Av. Paulista, 1000 - Bela Vista, SP",payment_method:"Pix",total_amount:399.9,status:"shipped",created_at:new Date(Date.now()-36e5).toISOString()},{id:"102",customer_name:"Mariana Souza",customer_phone:"(21) 99123-8877",delivery_address:"Rua Barata Ribeiro, 250 - Copacabana, RJ",payment_method:"Cartão de Crédito",total_amount:239,status:"preparing",created_at:new Date(Date.now()-72e5).toISOString()},{id:"103",customer_name:"Rodrigo Lima",customer_phone:"(31) 98844-5511",delivery_address:"Rua da Bahia, 500 - Centro, BH",payment_method:"Pix",total_amount:528.9,status:"pending",created_at:new Date(Date.now()-108e5).toISOString()},{id:"104",customer_name:"Camila Rocha",customer_phone:"(41) 97722-3344",delivery_address:"Rua XV de Novembro, 80 - Curitiba, PR",payment_method:"Dinheiro",total_amount:189.9,status:"shipped",created_at:new Date(Date.now()-864e5).toISOString()}]);const y=d.filter(p=>p.status!=="cancelled"),f=y.reduce((p,l)=>p+Number(l.total_amount),0),n=d.length,b=y.length>0?f/y.length:0,x=s.filter(p=>p.is_active!==!1).length,u=p=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(p),h=(p,l=null)=>p.map(a=>{const g=a.id===l,m=a.promo_price||a.price,v=a.promo_price?a.price:null,_=v&&Number(v)>Number(m);return`
            <div class="border border-gray-100 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-900 mb-3 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div onclick="window.toggleAdminProduct('${a.id}')" class="p-3 flex items-center justify-between bg-gray-55/50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-12 h-12 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0">
                    <img src="${a.image_url||""}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-black text-gray-800 dark:text-gray-100 truncate uppercase tracking-tight">${a.name||a.title}</h4>
                    <p class="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      ${_?`<span class="line-through mr-1.5 opacity-50">R$ ${v}</span>`:""}
                      <span class="${_?"text-red-650 dark:text-red-400 font-extrabold":"text-lojaPrimaria font-extrabold"}">R$ ${m}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-2">
                  <span class="text-gray-400 p-1.5 transition-transform duration-300 ${g?"rotate-180 text-lojaPrimaria":""}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>

              <div class="${g?"block":"hidden"} p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                <div class="space-y-4">
                    <div>
                        <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Descrição</h5>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">${a.description||"Sem descrição cadastrada."}</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      ${a.colors&&a.colors.length>0?`
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Cores Disponíveis</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${a.colors.map(j=>`<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${j}</span>`).join("")}
                              </div>
                          </div>
                      `:""}
                      ${a.attributes&&a.attributes.length>0?`
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tamanhos / Variações</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${a.attributes.map(j=>`<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${j}</span>`).join("")}
                              </div>
                          </div>
                      `:""}
                    </div>
                </div>
                
                <div class="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onclick="event.stopPropagation(); window.cloneAdminProduct('${a.id}')" class="bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                    Clonar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.editAdminProduct('${a.id}')" class="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Editar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.deleteAdminProduct('${a.id}')" class="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-650 dark:text-red-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          `}).join(""),k=p=>window.currentAdminTab===p?"bg-lojaPrimaria text-white shadow-lg shadow-lojaPrimaria/20 scale-[1.02]":"bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800/80";return`
        <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
          <div class="max-w-7xl mx-auto space-y-6">

            <!-- CABEÇALHO ADMIN PREMIUM -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800/80">
              <div class="flex items-center gap-4">
                ${t.logo_url?`<div class="w-12 h-12 rounded-2xl overflow-hidden border bg-white dark:bg-gray-800 flex items-center justify-center p-1"><img src="${t.logo_url}" class="max-h-full max-w-full object-contain" /></div>`:`<div class="w-12 h-12 rounded-2xl bg-lojaPrimaria/10 text-lojaPrimaria flex items-center justify-center font-black uppercase text-lg">${(t.store_name||"V").charAt(0)}</div>`}
                <div>
                  <div class="flex items-center gap-2.5">
                    <h1 class="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Painel Administrativo</h1>
                    ${r?'<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Configurado</span>':'<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">Pendente</span>'}
                  </div>
                  <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Loja: <span class="text-gray-900 dark:text-gray-200">${t.store_name||"Nova Loja"}</span></p>
                </div>
              </div>

              <!-- CONTROLES DO CABEÇALHO -->
              <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button onclick="window.toggleStoreTheme()" class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-150 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold p-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-sm" title="Alternar Tema">
                  <span id="theme-icon">${localStorage.getItem("theme")==="dark"?"☀️":"🌙"}</span>
                </button>
                <a href="/" class="flex-1 lg:flex-none text-center bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 font-black px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-md">
                  Ver Minha Vitrine
                </a>
                <button onclick="window.adminLogout()" class="bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-sm" title="Sair do Painel">
                  Sair
                </button>
              </div>
            </div>

            <!-- NAVEGAÇÃO POR ABAS (TABS) -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button onclick="window.toggleAdminTab('overview')" class="${k("overview")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📊 Visão Geral
              </button>
              <button onclick="window.toggleAdminTab('catalog')" class="${k("catalog")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                🛍️ Catálogo
              </button>
              <button onclick="window.toggleAdminTab('categories')" class="${k("categories")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📁 Categorias
              </button>
              <button onclick="window.toggleAdminTab('orders')" class="${k("orders")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📝 Pedidos (${d.filter(p=>p.status==="pending").length})
              </button>
              <button onclick="window.toggleAdminTab('settings')" class="${k("settings")} font-black col-span-2 md:col-span-1 px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                ⚙️ Configurações
              </button>
            </div>

            <!-- ABA 1: VISÃO GERAL (STATISTICS + PREP FLOW) -->
            <div class="${window.currentAdminTab==="overview"?"block":"hidden"} space-y-6 animate-in fade-in duration-300">
              
              <!-- CARDS DE ESTATÍSTICA -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Faturamento</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${u(f)}</h3>
                    <p class="text-[9px] text-green-500 font-extrabold uppercase mt-1">▲ Pedidos ativos</p>
                  </div>
                </div>
                <!-- Card 2 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedidos Totais</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${n}</h3>
                    <p class="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Histórico completo</p>
                  </div>
                </div>
                <!-- Card 3 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ticket Médio</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${u(b)}</h3>
                    <p class="text-[9px] text-lojaPrimaria font-extrabold uppercase mt-1">Média por venda</p>
                  </div>
                </div>
                <!-- Card 4 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produtos Ativos</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${x}</h3>
                    <p class="text-[9px] text-indigo-500 font-extrabold uppercase mt-1">Exibidos na vitrine</p>
                  </div>
                </div>
              </div>

              <!-- FLUXO DE PREPARO (KANBAN) -->
              <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight mb-4">Fluxo de Preparo em Tempo Real</h3>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- COLUNA: NOVOS -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                      📥 Novos Pedidos
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${d.filter(p=>p.status==="pending"||p.status==="new").map(p=>`
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-850 space-y-3 shadow-sm">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${p.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-bold tracking-tight">${new Date(p.created_at).toLocaleDateString()} às ${new Date(p.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">Pendente</span>
                          </div>
                          <div class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic leading-relaxed">
                            ${p.items_summary||"Ver no WhatsApp"}
                          </div>
                          <div class="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${u(p.total_amount)}</span></span>
                            <span>${p.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${p.id}', 'preparing')" class="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🍳 Preparar Pedido
                          </button>
                        </div>
                      `).join("")}
                      ${d.filter(p=>p.status==="pending"||p.status==="new").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido novo</p>':""}
                    </div>
                  </div>

                  <!-- COLUNA: EM PREPARO -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      🍳 Em Preparação
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${d.filter(p=>p.status==="preparing").map(p=>`
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-850 space-y-3 shadow-sm">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${p.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-bold tracking-tight">${new Date(p.created_at).toLocaleDateString()} às ${new Date(p.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">Preparando</span>
                          </div>
                          <div class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 italic leading-relaxed">
                            ${p.items_summary||"Ver no WhatsApp"}
                          </div>
                          <div class="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${u(p.total_amount)}</span></span>
                            <span>${p.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${p.id}', 'shipped')" class="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🚚 Enviar para Entrega
                          </button>
                        </div>
                      `).join("")}
                      ${d.filter(p=>p.status==="preparing").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido em preparo</p>':""}
                    </div>
                  </div>

                  <!-- COLUNA: ENTREGUES / ENVIADOS -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      🚚 Saiu / Entregue
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${d.filter(p=>p.status==="shipped"||p.status==="delivered").map(p=>`
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-150 dark:border-gray-850 space-y-2 shadow-sm opacity-80 hover:opacity-100 transition">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${p.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-medium">${new Date(p.created_at).toLocaleDateString()}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${p.status==="delivered"?"bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400":"bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"}">${p.status==="delivered"?"Entregue":"Saiu para Entrega"}</span>
                          </div>
                          <div class="text-[10px] text-gray-600 dark:text-gray-400 font-bold flex justify-between pt-1">
                            <span>Total: <span class="text-green-600 font-black">${u(p.total_amount)}</span></span>
                            ${p.status==="shipped"?`
                              <button onclick="window.advanceOrderStatus('${p.id}', 'delivered')" class="text-[9px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-lg">✓ Concluir</button>
                            `:""}
                          </div>
                        </div>
                      `).join("")}
                      ${d.filter(p=>p.status==="shipped"||p.status==="delivered").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido finalizado</p>':""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 2: CATALOGO (PRODUTOS) -->
            <div class="${window.currentAdminTab==="catalog"?"block":"hidden"} grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              
              <!-- FORMULÁRIO DE CADASTRO -->
              <div class="lg:col-span-5 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight" id="product-form-title">Cadastrar Novo Produto</h3>
                  
                  <form id="admin-product-form" class="space-y-4">
                    <input type="hidden" id="product-id" value="" />
                    
                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título do Produto *</label>
                       <input type="text" id="prod-title" required class="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-xl p-3.5 text-xs font-bold text-gray-955 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-lojaPrimaria" placeholder="Ex: Camiseta Premium Algodão" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Categoria *</label>
                         <select id="prod-category" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                            <option value="" disabled selected>Selecionar...</option>
                            ${c.map(p=>`<option value="${p.id}">${p.name}</option>`).join("")}
                            <option value="new">+ Criar Nova Categoria</option>
                         </select>
                      </div>
                      <div class="flex items-end">
                         <input type="text" id="new-category-name" class="hidden w-full bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 focus:outline-none" placeholder="Nome da Categoria" />
                      </div>
                    </div>

                    <div>
                       <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Descrição Curta</label>
                       <textarea id="prod-description" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-24 focus:outline-none" placeholder="Detalhes, especificações e cuidados com o produto..."></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço Original (R$) *</label>
                         <input type="number" step="0.01" id="prod-price" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="R$ 99,90" />
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Preço Promocional (R$)</label>
                         <input type="number" step="0.01" id="prod-promo" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="R$ 79,90" />
                      </div>
                    </div>

                    <div class="bg-gray-50/50 dark:bg-gray-950/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      ${T.render("prod","","Foto Principal do Produto")}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${i}</label>
                         <input type="text" id="prod-colors" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Separe por vírgula" />
                         <div id="colors-preview" class="flex flex-wrap gap-1 mt-1.5 min-h-[16px]"></div>
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${o}</label>
                         <input type="text" id="prod-attributes" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Separe por vírgula" />
                         <div id="attrs-preview" class="flex flex-wrap gap-1 mt-1.5 min-h-[16px]"></div>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Outras Imagens (URLs separadas por vírgula)</label>
                      <textarea id="prod-image-urls" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-20" placeholder="https://site.com/imagem2.jpg, https://site.com/imagem3.jpg"></textarea>
                    </div>

                    <button type="submit" id="btn-prod-submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition uppercase text-xs tracking-widest">
                       Adicionar ao Catálogo
                    </button>
                  </form>
                </div>
              </div>

              <!-- LISTAGEM DO CATALOGO -->
              <div class="lg:col-span-7 space-y-6">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Produtos no Catálogo (${s.length})</h3>
                  </div>
                  <div class="grid grid-cols-1 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin" id="admin-product-list">
                    ${h(s,window.currentExpandedId)}
                  </div>
                </div>
              </div>
            </div>

            <!-- ABA 3: CATEGORIAS -->
            <div class="${window.currentAdminTab==="categories"?"block":"hidden"} max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 animate-in fade-in duration-300">
               <div>
                  <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Gerenciador de Categorias</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Crie e exclua categorias para classificar os seus produtos.</p>
               </div>

               <!-- Form simples de Categoria -->
               <form id="admin-direct-category-form" class="flex gap-2">
                 <input type="text" id="direct-cat-name" required class="flex-grow bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Ex: Calçados, Acessórios" />
                 <button type="submit" class="bg-lojaPrimaria text-white font-black px-6 py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-1.5 shadow-sm">
                   Adicionar
                 </button>
               </form>

               <div class="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                  ${c.map(p=>`
                    <div class="flex items-center justify-between bg-gray-55/50 dark:bg-gray-950/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-red-100 dark:hover:border-red-950/30 transition">
                       <div>
                         <span class="text-xs font-black text-gray-850 dark:text-gray-200 uppercase tracking-widest">${p.name}</span>
                         <span class="block text-[9px] text-gray-400 font-mono mt-0.5">Slug: ${p.slug}</span>
                       </div>
                       <button onclick="window.deleteCategory('${p.id}')" class="text-gray-300 hover:text-red-605 transition p-2 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-xl">
                            <svg xmlns="http://www.w3.org/2050/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  `).join("")}
                  ${c.length===0?'<p class="text-center text-gray-400 py-6 text-xs uppercase tracking-widest font-bold">Nenhuma categoria cadastrada</p>':""}
               </div>
            </div>

            <!-- ABA 4: HISTÓRICO DE PEDIDOS -->
            <div class="${window.currentAdminTab==="orders"?"block":"hidden"} space-y-6 animate-in fade-in duration-300">
               <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                     Central Histórica de Pedidos
                  </h2>

                  <div class="space-y-8">
                     ${(()=>{const p={};return d.forEach(l=>{const a=new Date(l.created_at),g=new Date,m=new Date(g);m.setDate(m.getDate()-1);let v=a.toLocaleDateString("pt-BR");a.toDateString()===g.toDateString()?v="Hoje":a.toDateString()===m.toDateString()&&(v="Ontem"),p[v]||(p[v]=[]),p[v].push(l)}),Object.entries(p).map(([l,a])=>`
                           <div class="space-y-4">
                              <div class="flex items-center gap-4">
                                 <span class="text-[9px] font-black text-gray-450 dark:text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">Pedidos de ${l}</span>
                                 <div class="h-px bg-gray-100 dark:bg-gray-800/80 w-full"></div>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 ${a.map(g=>{let m="bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20";return g.status==="preparing"&&(m="bg-amber-50 text-amber-600 dark:bg-amber-950/20"),g.status==="shipped"&&(m="bg-purple-50 text-purple-600 dark:bg-purple-950/20"),g.status==="delivered"&&(m="bg-green-50 text-green-600 dark:bg-green-950/20"),g.status==="cancelled"&&(m="bg-red-50 text-red-650 dark:bg-red-950/20"),`
                                    <div class="bg-gray-55/50 dark:bg-gray-900/50 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 space-y-4 hover:border-lojaPrimaria/30 transition group shadow-sm">
                                       <div class="flex justify-between items-start">
                                          <div>
                                             <p class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">#${g.id.slice(0,8)} • ${new Date(g.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                                             <h4 class="text-xs font-black text-gray-950 dark:text-white uppercase tracking-tight">${g.customer_name}</h4>
                                          </div>
                                          <span class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${m}">${g.status}</span>
                                       </div>

                                       <div class="space-y-2">
                                          <div class="text-[10px] text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-850/80 leading-relaxed italic">
                                             ${g.items_summary||"Itens não especificados"}
                                          </div>
                                       </div>

                                       <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Entrega</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase truncate">${g.delivery_address?"Delivery":"Retirada"}</p>
                                          </div>
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Pagamento</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">${g.payment_method}</p>
                                          </div>
                                          <div class="col-span-2 text-right pt-2 border-t border-gray-100 dark:border-gray-800/50">
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Total</p>
                                             <p class="text-sm font-black text-lojaPrimaria">${u(g.total_amount)}</p>
                                          </div>
                                       </div>

                                       <div class="flex gap-2">
                                          <button onclick="window.advanceOrderStatus('${g.id}', '${g.status==="pending"?"preparing":g.status==="preparing"?"shipped":"delivered"}')" class="flex-1 bg-white dark:bg-gray-800 border border-gray-205 dark:border-gray-700 hover:border-lojaPrimaria text-gray-900 dark:text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition shadow-sm">
                                             Status
                                          </button>
                                          <button onclick="window.advanceOrderStatus('${g.id}', 'cancelled')" class="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition">
                                             ✕ Cancelar
                                          </button>
                                       </div>
                                    </div>
                                    `}).join("")}
                              </div>
                           </div>
                        `).join("")})()}
                     ${d.length===0?'<p class="text-center text-gray-400 dark:text-gray-500 py-12 text-xs uppercase tracking-widest font-black">Nenhum pedido registrado no sistema</p>':""}
                  </div>
               </div>
            </div>

            <!-- ABA 5: CONFIGURAÇÕES DA LOJA -->
            <div class="${window.currentAdminTab==="settings"?"block":"hidden"} max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div class="p-6 border-b border-gray-50 dark:border-gray-850/80 bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Identidade & Configurações da Vitrine</h3>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure o visual, contato do WhatsApp e cores do tema.</p>
                  </div>

                  <form id="admin-tenant-form" class="p-6 space-y-6 bg-white dark:bg-gray-900">
                    
                    <!-- Bloco Identidade -->
                    <div class="space-y-4">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Identidade da Loja</h4>
                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja *</label>
                        <input type="text" id="conf-name" value="${t.store_name||""}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100 focus:ring-2 focus:ring-lojaPrimaria" />
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2 bg-gray-50/30 dark:bg-gray-955/40 p-4 rounded-2xl border dark:border-gray-850">
                          ${T.render("logo",t.logo_url,"Logotipo da Loja")}
                          ${t.logo_url?`<button type="button" onclick="window.removeTenantMedia('logo')" class="text-[9px] font-black uppercase text-red-650 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-100/50 transition">✕ Remover Imagem</button>`:""}
                        </div>
                        <div class="space-y-2 bg-gray-50/30 dark:bg-gray-955/40 p-4 rounded-2xl border dark:border-gray-850">
                          ${T.render("hero",t.hero_image_url,"Banner Hero da Vitrine")}
                          ${t.hero_image_url?`<button type="button" onclick="window.removeTenantMedia('hero')" class="text-[9px] font-black uppercase text-red-650 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-100/50 transition">✕ Remover Imagem</button>`:""}
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título do Hero (Banner)</label>
                          <input type="text" id="conf-hero-title" value="${t.hero_title||""}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Ex: Nova Coleção de Verão" />
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Subtítulo do Hero</label>
                          <input type="text" id="conf-hero-subtitle" value="${t.hero_subtitle||""}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Ex: Até 50% de Desconto" />
                        </div>
                      </div>

                      <div class="pt-2">
                         <label class="flex items-center gap-3 cursor-pointer group">
                           <div class="relative">
                             <input type="checkbox" id="conf-show-hero-text" ${t.footer_bio!=="HIDE_HERO_TEXT"?"checked":""} class="sr-only peer" />
                             <div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lojaPrimaria"></div>
                           </div>
                           <span class="text-[10px] font-black text-gray-500 dark:text-gray-450 uppercase tracking-widest group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">Exibir título e subtítulo sobre o Banner Hero</span>
                         </label>
                      </div>
                    </div>

                    <!-- Bloco Aparência e Cores -->
                    <div class="space-y-4 pt-4 border-t dark:border-gray-800">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Cores da Identidade Visual</h4>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-955 rounded-xl p-1.5 pr-4 border dark:border-gray-850">
                            <input type="color" id="conf-primary" value="${t.primary_color||"#3b82f6"}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                            <span class="text-xs font-mono font-black text-gray-600 dark:text-gray-400 uppercase">${t.primary_color||"#3b82f6"}</span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-955 rounded-xl p-1.5 pr-4 border dark:border-gray-850">
                            <input type="color" id="conf-secondary" value="${t.secondary_color||"#1e3a8a"}" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer" />
                            <span class="text-xs font-mono font-black text-gray-600 dark:text-gray-400 uppercase">${t.secondary_color||"#1e3a8a"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Bloco Contato e Entrega -->
                    <div class="space-y-4 pt-4 border-t dark:border-gray-800">
                      <h4 class="text-xs font-black text-lojaPrimaria uppercase tracking-wider border-b pb-2 dark:border-gray-800">Contato, Endereço & Redes</h4>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp (Ex: 5511999999999) *</label>
                          <input type="text" id="conf-phone" value="${t.whatsapp_number||""}" required class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Código do país + DDD + Número" />
                        </div>
                        <div>
                          <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Taxa de Entrega Padrão (R$)</label>
                          <input type="number" step="0.01" id="conf-delivery-fee" value="${t.delivery_fee||"0.00"}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Endereço Físico</label>
                        <input type="text" id="conf-address" value="${t.address||""}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="Rua das Flores, 123 - São Paulo" />
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Link do Instagram (URL)</label>
                           <input type="text" id="conf-instagram" value="${t.instagram_url||""}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://instagram.com/sualoja" />
                        </div>
                        <div>
                           <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Link do Facebook (URL)</label>
                           <input type="text" id="conf-facebook" value="${t.facebook_url||""}" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-950 dark:text-gray-100" placeholder="https://facebook.com/sualoja" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">Biografia / Rodapé Curto</label>
                        <textarea id="conf-footer-bio" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100 h-20" placeholder="Uma breve descrição sobre sua loja para exibir no rodapé da página.">${t.footer_bio&&t.footer_bio!=="SHOW_HERO_TEXT"&&t.footer_bio!=="HIDE_HERO_TEXT"?t.footer_bio:""}</textarea>
                      </div>
                    </div>

                    <button type="submit" id="btn-save-tenant" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg shadow-lojaPrimaria/25 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest mt-4">
                      <span id="btn-save-text">Salvar Alterações da Loja</span>
                      <div id="btn-save-loader" class="hidden animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    </button>
                  </form>
                </div>
            </div>

          </div>
        </div>

        <!-- MODAL DE EXCLUSÃO DE PRODUTO -->
        <div id="delete-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 hidden">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
            <h3 class="text-center text-lg font-black text-gray-900 dark:text-gray-100 mb-2">Excluir Produto?</h3>
            <p class="text-center text-gray-500 dark:text-gray-450 text-xs font-bold uppercase tracking-widest mb-2">Você quer excluir permanentemente o item <span id="delete-item-name" class="text-red-500 font-black"></span>?</p>
            <p class="text-center text-red-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8 opacity-60">Essa operação não poderá ser revertida</p>
            <div class="grid grid-cols-2 gap-4">
              <button id="btn-cancel-delete" class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-200 transition">Cancelar</button>
              <button id="btn-confirm-delete" class="bg-red-500 hover:bg-red-650 text-white font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition shadow-lg shadow-red-500/20">Sim, Excluir</button>
            </div>
          </div>
        </div>
      `}catch(e){return console.error(e),'<div class="p-20 text-center font-black uppercase text-red-500">Erro de Conexão com o Supabase. Verifique sua chave API.</div>'}},bindEvents(e,t){const i=e.querySelector("#admin-tenant-form"),o=e.querySelector("#admin-product-form"),r=e.querySelector("#prod-category"),s=e.querySelector("#new-category-name"),c=e.querySelector("#admin-direct-category-form"),d=e.querySelector("#prod-colors"),y=e.querySelector("#colors-preview"),f=e.querySelector("#prod-attributes"),n=e.querySelector("#attrs-preview"),b=(l,a)=>{if(!l||!a)return;const g=l.value.split(",").map(m=>m.trim()).filter(m=>m);a.innerHTML=g.map(m=>`
        <span class="inline-flex items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase border border-gray-200 dark:border-gray-700">
          ${m}
        </span>
      `).join("")};if(d&&y&&(d.oninput=()=>b(d,y),b(d,y)),f&&n&&(f.oninput=()=>b(f,n),b(f,n)),T.bindEvents("logo",l=>{l||(e.querySelector("#url-logo").value="")}),T.bindEvents("hero",l=>{l||(e.querySelector("#url-hero").value="")}),T.bindEvents("prod",l=>{l||(e.querySelector("#url-prod").value="")}),window.removeTenantMedia=async l=>{const a=l==="logo"?"logo_url":"hero_image_url",{data:g}=await w.from("tenant_settings").select("id").maybeSingle();if(g){const{error:m}=await w.from("tenant_settings").update({[a]:null}).eq("id",g.id);m?S.show("Erro ao remover: "+m.message,"error"):(S.show("Imagem removida com sucesso!"),t())}},window.toggleAdminTab=l=>{window.currentAdminTab=l,t()},window.toggleStoreTheme=()=>{const l=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",l?"dark":"light");const a=e.querySelector("#theme-icon");a&&(a.innerText=l?"☀️":"🌙")},window.adminLogout=()=>{localStorage.removeItem("admin_auth"),S.show("Você saiu do painel administrativo.","info"),setTimeout(()=>{window.location.search=""},300)},localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark");const l=e.querySelector("#theme-icon");l&&(l.innerText="☀️")}r&&(r.onchange=()=>{r.value==="new"?(s.classList.remove("hidden"),s.required=!0,s.focus()):(s.classList.add("hidden"),s.required=!1)}),c&&(c.onsubmit=async l=>{l.preventDefault();const a=e.querySelector("#direct-cat-name"),g=a.value.trim();if(g)try{const m=g.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-"),{data:v}=await w.from("tenant_settings").select("id").maybeSingle(),{error:_}=await w.from("categories").insert({name:g,slug:m,tenant_id:(v==null?void 0:v.id)||null});if(_)throw _;S.show("Categoria criada com sucesso!"),a.value="",t()}catch(m){S.show("Erro ao criar categoria: "+m.message,"error")}}),i&&(i.onsubmit=async l=>{l.preventDefault();const a=e.querySelector("#btn-save-tenant"),g=e.querySelector("#btn-save-text"),m=e.querySelector("#btn-save-loader");a.disabled=!0,g.classList.add("hidden"),m.classList.remove("hidden");try{const v={store_name:e.querySelector("#conf-name").value,logo_url:e.querySelector("#url-logo").value,hero_image_url:e.querySelector("#url-hero").value,hero_title:e.querySelector("#conf-hero-title").value,hero_subtitle:e.querySelector("#conf-hero-subtitle").value,whatsapp_number:e.querySelector("#conf-phone").value,delivery_fee:parseFloat(e.querySelector("#conf-delivery-fee").value||0),address:e.querySelector("#conf-address").value,primary_color:e.querySelector("#conf-primary").value,secondary_color:e.querySelector("#conf-secondary").value,instagram_url:e.querySelector("#conf-instagram").value,facebook_url:e.querySelector("#conf-facebook").value,footer_bio:e.querySelector("#conf-footer-bio").value||(e.querySelector("#conf-show-hero-text").checked?"SHOW_HERO_TEXT":"HIDE_HERO_TEXT")};v.footer_bio||(v.footer_bio=e.querySelector("#conf-show-hero-text").checked?"SHOW_HERO_TEXT":"HIDE_HERO_TEXT");const{data:_}=await w.from("tenant_settings").select("id").maybeSingle();let j;if(_?j=(await w.from("tenant_settings").update(v).eq("id",_.id)).error:j=(await w.from("tenant_settings").insert(v)).error,!j)N(v.primary_color,v.secondary_color),S.show("Configurações da loja salvas com sucesso!"),t();else throw j}catch(v){S.show("Erro ao salvar: "+v.message,"error"),a.disabled=!1,g.classList.remove("hidden"),m.classList.add("hidden")}});const x=e.querySelector("#delete-modal"),u=e.querySelector("#delete-item-name"),h=e.querySelector("#btn-cancel-delete"),k=e.querySelector("#btn-confirm-delete");let p=null;window.toggleAdminProduct=l=>{window.currentExpandedId=window.currentExpandedId===l?null:l,t()},window.deleteAdminProduct=async l=>{const{data:a}=await w.from("products").select("title").eq("id",l).single();p=l,u.innerText=(a==null?void 0:a.title)||"este produto",x.classList.remove("hidden")},window.deleteCategory=async l=>{if(confirm("Atenção: Excluir esta categoria poderá desvincular produtos. Deseja prosseguir com a exclusão?")){const{error:a}=await w.from("categories").delete().eq("id",l);a?S.show("Erro ao excluir: "+a.message,"error"):(S.show("Categoria removida com sucesso!"),t())}},h.onclick=()=>x.classList.add("hidden"),k.onclick=async()=>{const{error:l}=await w.from("products").delete().eq("id",p);l?S.show("Erro ao deletar produto: "+l.message,"error"):S.show("Produto excluído do catálogo!"),x.classList.add("hidden"),t()},window.cloneAdminProduct=async l=>{const{data:a}=await w.from("products").select("*").eq("id",l).single();a&&(window.currentAdminTab="catalog",t(),setTimeout(()=>{const g=e.querySelector("#product-form-title"),m=e.querySelector("#btn-prod-submit");g&&(g.innerText="Clonando: "+a.title),m&&(m.innerText="Adicionar como Novo"),e.querySelector("#product-id").value="",e.querySelector("#prod-title").value=a.title+" (Cópia)",e.querySelector("#prod-category").value=a.category_id||"",e.querySelector("#prod-description").value=a.description||"",e.querySelector("#prod-price").value=a.price,e.querySelector("#prod-promo").value=a.promo_price||"";const v=e.querySelector("#prod-colors"),_=e.querySelector("#prod-attributes");v.value=Array.isArray(a.colors)?a.colors.join(", "):"",_.value=Array.isArray(a.attributes)?a.attributes.join(", "):"",v.dispatchEvent(new Event("input")),_.dispatchEvent(new Event("input"));const j=Array.isArray(a.image_urls)?a.image_urls.filter(A=>A!==a.image_url):[];e.querySelector("#prod-image-urls").value=j.join(", ");const C=e.querySelector("#url-prod");C.value=a.image_url||"";const q=e.querySelector("#container-prod").querySelector(".relative"),E=document.getElementById("remove-prod");a.image_url&&(E&&(E.classList.remove("hidden"),E.classList.add("flex")),q.innerHTML=`
                  <img src="${a.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                  </div>
              `),window.scrollTo({top:0,behavior:"smooth"})},100))},window.advanceOrderStatus=async(l,a)=>{const{error:g}=await w.from("orders").update({status:a}).eq("id",l);g?S.show("Erro ao atualizar status do pedido: "+g.message,"error"):(S.show("Status do pedido atualizado!"),t())},window.editAdminProduct=async l=>{const{data:a}=await w.from("products").select("*").eq("id",l).single();a&&(window.currentAdminTab="catalog",t(),setTimeout(()=>{const g=e.querySelector("#product-form-title"),m=e.querySelector("#btn-prod-submit");g&&(g.innerText="Editando: "+a.title),m&&(m.innerText="Salvar Alterações"),e.querySelector("#product-id").value=a.id,e.querySelector("#prod-title").value=a.title,e.querySelector("#prod-category").value=a.category_id||"",e.querySelector("#prod-description").value=a.description||"",e.querySelector("#prod-price").value=a.price,e.querySelector("#prod-promo").value=a.promo_price||"";const v=e.querySelector("#prod-colors"),_=e.querySelector("#prod-attributes");v.value=Array.isArray(a.colors)?a.colors.join(", "):"",_.value=Array.isArray(a.attributes)?a.attributes.join(", "):"",v.dispatchEvent(new Event("input")),_.dispatchEvent(new Event("input"));const j=Array.isArray(a.image_urls)?a.image_urls.filter(A=>A!==a.image_url):[];e.querySelector("#prod-image-urls").value=j.join(", ");const C=e.querySelector("#url-prod");C.value=a.image_url||"";const q=e.querySelector("#container-prod").querySelector(".relative"),E=document.getElementById("remove-prod");a.image_url&&(E&&(E.classList.remove("hidden"),E.classList.add("flex")),q.innerHTML=`
                  <img src="${a.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                  </div>
              `),window.scrollTo({top:0,behavior:"smooth"})},100))},o&&(o.onsubmit=async l=>{l.preventDefault();try{let a=r.value;const g=e.querySelector("#product-id").value,{data:m}=await w.from("tenant_settings").select("id").maybeSingle();if(a==="new"){const $=s.value,D=$.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-"),{data:B,error:I}=await w.from("categories").insert({name:$,slug:D,tenant_id:(m==null?void 0:m.id)||null}).select().single();if(I)throw I;a=B.id}const v=e.querySelector("#prod-price").value,_=e.querySelector("#prod-promo").value,j=e.querySelector("#prod-image-urls").value.split(",").map($=>$.trim()).filter($=>$),C=e.querySelector("#url-prod").value,q={title:e.querySelector("#prod-title").value,category_id:a||null,description:e.querySelector("#prod-description").value,price:parseFloat(v),promo_price:_?parseFloat(_):null,image_url:C,image_urls:[C,...j].filter($=>$),colors:e.querySelector("#prod-colors").value.split(",").map($=>$.trim()).filter($=>$),attributes:e.querySelector("#prod-attributes").value.split(",").map($=>$.trim()).filter($=>$),tenant_id:(m==null?void 0:m.id)||null};let E;if(g?E=(await w.from("products").update(q).eq("id",g)).error:E=(await w.from("products").insert(q)).error,E)throw E;S.show("Produto salvo no catálogo com sucesso!"),o.reset(),e.querySelector("#prod-image-urls").value="",e.querySelector("#product-id").value="",e.querySelector("#product-form-title").innerText="Cadastrar Novo Produto",e.querySelector("#btn-prod-submit").innerText="Adicionar ao Catálogo";const A=e.querySelector("#container-prod").querySelector(".relative"),L=document.getElementById("remove-prod");L&&(L.classList.remove("flex"),L.classList.add("hidden")),A.innerHTML=`
              <div id="placeholder-prod" class="text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
              </div>
              <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
              </div>
          `,t()}catch(a){S.show("Erro ao salvar produto: "+a.message,"error")}})}},K={async render(){try{window.superAdminTab=window.superAdminTab||"tenants";const{data:e,error:t}=await w.from("tenant_settings").select("*").order("created_at",{ascending:!1});if(t)throw t;const i=e||[],o=r=>r?new Date(r).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}):"—";return`
        <div class="min-h-screen bg-gray-950 text-white">
          <!-- Top Navigation Bar -->
          <header class="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h1 class="text-sm font-black text-white uppercase tracking-tight">Super Admin</h1>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">CatálogoPro Platform</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  ${i.length} lojas ativas
                </span>
                <a href="/" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition px-3 py-2 rounded-xl hover:bg-white/5">
                  ← Portal
                </a>
                <button id="super-logout-btn" class="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition">
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div class="max-w-7xl mx-auto px-6 py-8 space-y-8">

            <!-- Tabs -->
            <nav class="flex gap-2">
              ${[{id:"tenants",label:"🏪 Gerenciar Lojas"},{id:"create",label:"+ Nova Loja"}].map(r=>`
                <button onclick="window.superAdminTab='${r.id}'; window.refreshSuperAdmin()" 
                  class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition border ${window.superAdminTab===r.id?"bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/30":"bg-white/5 text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300"}">
                  ${r.label}
                </button>
              `).join("")}
            </nav>

            <!-- Tenants List Tab -->
            <div class="${window.superAdminTab==="tenants"?"block":"hidden"} space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xs font-black text-gray-500 uppercase tracking-widest">Todos os Lojistas (${i.length})</h2>
              </div>

              ${i.length===0?`
                <div class="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
                  <div class="text-6xl">🏪</div>
                  <p class="text-gray-500 font-bold">Nenhuma loja cadastrada.</p>
                  <button onclick="window.superAdminTab='create'; window.refreshSuperAdmin()" class="bg-violet-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-violet-500 transition">
                    Criar primeira loja
                  </button>
                </div>
              `:i.map(r=>`
                <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-violet-500/30 hover:bg-white/[0.05] transition group">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    ${r.logo_url?`<img src="${r.logo_url}" class="w-14 h-14 rounded-2xl object-cover border border-white/10 flex-shrink-0" onerror="this.style.display='none'" />`:`<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0" style="background:${r.primary_color||"#6d28d9"}33; color:${r.primary_color||"#a78bfa"}">${(r.store_name||"?").charAt(0)}</div>`}
                    <div class="min-w-0">
                      <h3 class="font-black text-white text-sm uppercase tracking-tight truncate">${r.store_name||"(sem nome)"}</h3>
                      <p class="text-[10px] text-gray-600 font-bold mt-0.5">slug: <span class="text-violet-400">/${r.slug||r.id}</span></p>
                      <p class="text-[10px] text-gray-700 font-bold">WhatsApp: ${r.whatsapp_number||"—"} · Criado em ${o(r.created_at)}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <a href="/?store=${r.slug||r.id}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-violet-400 transition px-3 py-2 rounded-xl border border-white/10 hover:border-violet-500/30">
                      Ver Vitrine ↗
                    </a>
                    <button onclick="window.superAdminEditTenant('${r.id}')" class="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition px-3 py-2 rounded-xl border border-blue-500/20 hover:border-blue-500/40">
                      Editar
                    </button>
                    <button onclick="window.superAdminDeleteTenant('${r.id}', '${r.store_name||r.id}')" class="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition px-3 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40">
                      Excluir
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>

            <!-- Create Tenant Tab -->
            <div class="${window.superAdminTab==="create"?"block":"hidden"} max-w-2xl">
              <div class="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div class="p-6 border-b border-white/5">
                  <h2 class="font-black text-white text-sm uppercase tracking-tight">Nova Loja</h2>
                  <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Preencha os dados para cadastrar um novo lojista</p>
                </div>
                <form id="super-create-tenant-form" class="p-6 space-y-5">
                  <input type="hidden" id="edit-tenant-id" value="" />

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nome da Loja *</label>
                      <input type="text" id="t-store-name" required placeholder="Ex: Pizzaria Roma"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Slug Único *</label>
                      <input type="text" id="t-slug" required placeholder="pizzaria-roma"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      <p class="text-[9px] text-gray-700 mt-1">URL: /?store=<span id="slug-preview" class="text-violet-400">...</span></p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">WhatsApp *</label>
                      <input type="text" id="t-whatsapp" required placeholder="5511999999999"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">E-mail do Proprietário</label>
                      <input type="email" id="t-owner-email" placeholder="lojista@email.com"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      <p class="text-[9px] text-gray-700 mt-1">Vincula ao login do lojista no painel</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Título Hero</label>
                      <input type="text" id="t-hero-title" placeholder="Os melhores sabores da cidade"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Subtítulo Hero</label>
                      <input type="text" id="t-hero-subtitle" placeholder="Peça agora pelo WhatsApp"
                        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Primária</label>
                      <div class="flex items-center gap-3">
                        <input type="color" id="t-primary-color" value="#6d28d9" class="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                        <input type="text" id="t-primary-color-hex" value="#6d28d9"
                          class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Cor Secundária</label>
                      <div class="flex items-center gap-3">
                        <input type="color" id="t-secondary-color" value="#4c1d95" class="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                        <input type="text" id="t-secondary-color-hex" value="#4c1d95"
                          class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                  </div>

                  <!-- Niche Configuration -->
                  <div class="border-t border-white/5 pt-5 space-y-4">
                    <h4 class="text-[10px] font-black text-violet-400 uppercase tracking-widest">Configuração de Nicho</h4>
                    <p class="text-[10px] text-gray-600">Defina os rótulos dos atributos de produto para este nicho (ex: restaurante → "Adicionais" e "Bebida"; vestuário → "Tamanho" e "Cor")</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Rótulo Opção 1</label>
                        <input type="text" id="t-option1-label" placeholder="Ex: Tamanho / Adicionais"
                          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                      <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Rótulo Opção 2</label>
                        <input type="text" id="t-option2-label" placeholder="Ex: Cor / Bebida"
                          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/60 transition" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Nicho / Segmento</label>
                      <select id="t-niche" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                        <option value="">Selecionar nicho</option>
                        <option value="fashion">👗 Moda & Vestuário</option>
                        <option value="food">🍕 Restaurante & Alimentação</option>
                        <option value="beauty">💄 Beleza & Estética</option>
                        <option value="electronics">📱 Eletrônicos & Tech</option>
                        <option value="pets">🐾 Pet Shop</option>
                        <option value="home">🏠 Casa & Decoração</option>
                        <option value="sports">⚽ Esportes & Lazer</option>
                        <option value="other">🏪 Outros</option>
                      </select>
                    </div>
                  </div>

                  <div class="pt-2">
                    <button type="submit" id="btn-super-save-tenant" class="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-violet-900/40 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                      Salvar Loja
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `}catch(e){return console.error("Erro ao renderizar Super Admin:",e),`<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white text-center p-8">
        <div><h2 class="text-2xl font-black mb-2">Erro</h2><p class="text-gray-500">${e.message}</p></div>
      </div>`}},bindEvents(e,t){var b;window.refreshSuperAdmin=t,(b=e.querySelector("#super-logout-btn"))==null||b.addEventListener("click",async()=>{await w.auth.signOut(),window.location.search=""});const i=e.querySelector("#t-slug"),o=e.querySelector("#slug-preview");i&&o&&(i.oninput=()=>{const x=i.value.toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/--+/g,"-");i.value=x,o.textContent=x||"..."});const r=e.querySelector("#t-store-name");r&&i&&(r.oninput=()=>{if(!e.querySelector("#edit-tenant-id").value){const x=r.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");i.value=x,o&&(o.textContent=x||"...")}});const s=(x,u)=>{const h=e.querySelector(`#${x}`),k=e.querySelector(`#${u}`);!h||!k||(h.oninput=()=>{k.value=h.value},k.oninput=()=>{/^#[0-9A-Fa-f]{6}$/.test(k.value)&&(h.value=k.value)})};s("t-primary-color","t-primary-color-hex"),s("t-secondary-color","t-secondary-color-hex");const c=e.querySelector("#t-niche"),d=e.querySelector("#t-option1-label"),y=e.querySelector("#t-option2-label"),f={fashion:{o1:"Tamanho",o2:"Cor"},food:{o1:"Adicionais",o2:"Bebida"},beauty:{o1:"Variação",o2:"Cor"},electronics:{o1:"Capacidade",o2:"Cor"},pets:{o1:"Tamanho",o2:"Cor"},home:{o1:"Dimensão",o2:"Cor"},sports:{o1:"Tamanho",o2:"Cor"}};c&&(c.onchange=()=>{const x=f[c.value];x&&(d&&(d.value=x.o1),y&&(y.value=x.o2))}),window.superAdminEditTenant=async x=>{const{data:u}=await w.from("tenant_settings").select("*").eq("id",x).single();u&&(window.superAdminTab="create",t(),setTimeout(()=>{const h=(p,l)=>{const a=e.querySelector(p);a&&(a.value=l||"")};h("#edit-tenant-id",u.id),h("#t-store-name",u.store_name),h("#t-slug",u.slug),h("#t-whatsapp",u.whatsapp_number),h("#t-hero-title",u.hero_title),h("#t-hero-subtitle",u.hero_subtitle),h("#t-primary-color",u.primary_color||"#6d28d9"),h("#t-primary-color-hex",u.primary_color||"#6d28d9"),h("#t-secondary-color",u.secondary_color||"#4c1d95"),h("#t-secondary-color-hex",u.secondary_color||"#4c1d95"),h("#t-option1-label",u.option1_label),h("#t-option2-label",u.option2_label),h("#t-niche",u.niche),o&&(o.textContent=u.slug||"...");const k=e.querySelector("#btn-super-save-tenant");k&&(k.innerText="Salvar Alterações")},100))},window.superAdminDeleteTenant=async(x,u)=>{if(!confirm(`Tem certeza que deseja excluir a loja "${u}"? Esta ação é irreversível.`))return;const{error:h}=await w.from("tenant_settings").delete().eq("id",x);h?S.show("Erro ao excluir: "+h.message,"error"):(S.show(`Loja "${u}" excluída com sucesso!`),t())};const n=e.querySelector("#super-create-tenant-form");n&&(n.onsubmit=async x=>{var l,a,g,m,v,_,j,C,q,E,A,L,$,D,B,I,H,F,V,U;x.preventDefault();const u=(l=e.querySelector("#edit-tenant-id"))==null?void 0:l.value,h={store_name:(g=(a=e.querySelector("#t-store-name"))==null?void 0:a.value)==null?void 0:g.trim(),slug:(v=(m=e.querySelector("#t-slug"))==null?void 0:m.value)==null?void 0:v.trim(),whatsapp_number:(j=(_=e.querySelector("#t-whatsapp"))==null?void 0:_.value)==null?void 0:j.trim(),hero_title:((q=(C=e.querySelector("#t-hero-title"))==null?void 0:C.value)==null?void 0:q.trim())||null,hero_subtitle:((A=(E=e.querySelector("#t-hero-subtitle"))==null?void 0:E.value)==null?void 0:A.trim())||null,primary_color:((L=e.querySelector("#t-primary-color-hex"))==null?void 0:L.value)||"#6d28d9",secondary_color:(($=e.querySelector("#t-secondary-color-hex"))==null?void 0:$.value)||"#4c1d95",option1_label:((B=(D=e.querySelector("#t-option1-label"))==null?void 0:D.value)==null?void 0:B.trim())||null,option2_label:((H=(I=e.querySelector("#t-option2-label"))==null?void 0:I.value)==null?void 0:H.trim())||null,niche:((F=e.querySelector("#t-niche"))==null?void 0:F.value)||null},k=(U=(V=e.querySelector("#t-owner-email"))==null?void 0:V.value)==null?void 0:U.trim();if(k){const{data:ie}=await w.from("tenant_settings").select("owner_id").eq("owner_id",k).limit(1);h.owner_email=k}let p;u?{error:p}=await w.from("tenant_settings").update(h).eq("id",u):{error:p}=await w.from("tenant_settings").insert(h),p?S.show("Erro: "+p.message,"error"):(S.show(u?"Loja atualizada com sucesso!":"Nova loja criada com sucesso!"),window.superAdminTab="tenants",t())})}},Y={render(){return`
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
        <div class="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md space-y-6 animate-in fade-in">
          
          <div class="text-center space-y-2">
            <div class="w-14 h-14 bg-lojaPrimaria/10 text-lojaPrimaria rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Painel Administrativo</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Acesse as métricas, catálogo e pedidos da sua loja.</p>
          </div>

          <!-- Dica rápida para quem está avaliando o portfólio -->
          <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 text-xs text-blue-700 dark:text-blue-300 space-y-2">
            <div class="flex items-center gap-1.5 font-bold">
              <span>💡</span>
              <span>Acesso para Avaliação de Portfólio</span>
            </div>
            <p class="text-[11px] leading-relaxed opacity-90">
              Você pode usar o botão de acesso rápido abaixo ou entrar com <strong>admin@catalogopro.com</strong> e qualquer senha.
            </p>
            <button id="quick-login-btn" type="button" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-98">
              ⚡ Entrar como Administrador (1-Clique)
            </button>
          </div>
          
          <div class="relative flex items-center justify-center">
            <span class="border-t border-gray-200 dark:border-gray-800 w-full"></span>
            <span class="bg-white dark:bg-gray-900 px-3 text-[10px] font-black uppercase tracking-widest text-gray-400">ou informe os dados</span>
            <span class="border-t border-gray-200 dark:border-gray-800 w-full"></span>
          </div>

          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">E-mail</label>
              <input 
                type="email" 
                id="login-email" 
                required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-lojaPrimaria focus:outline-none transition" 
                placeholder="admin@catalogopro.com" 
                value="admin@catalogopro.com"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Senha</label>
              <input 
                type="password" 
                id="login-password" 
                required 
                class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:bg-white focus:ring-2 focus:ring-lojaPrimaria focus:outline-none transition" 
                placeholder="••••••••" 
                value="admin123"
              />
            </div>
            
            <button type="submit" class="w-full bg-gray-900 dark:bg-lojaPrimaria hover:bg-opacity-90 text-white font-black py-3.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md mt-2 active:scale-98">
              Acessar Painel
            </button>
          </form>
          
          <div class="text-center pt-2">
            <a href="/" class="text-xs text-gray-400 hover:text-lojaPrimaria transition font-bold">← Voltar para a Vitrine</a>
          </div>
        </div>
      </div>
    `},bindEvents(e){const t=(r="admin@catalogopro.com")=>{localStorage.setItem("admin_auth",JSON.stringify({email:r,name:"Administrador",authenticated:!0,loginAt:Date.now()})),S.show("Login realizado com sucesso! Carregando painel...","success"),setTimeout(()=>{window.location.search="?page=admin"},300)},i=e.querySelector("#quick-login-btn");i&&(i.onclick=()=>t("admin@catalogopro.com"));const o=e.querySelector("#login-form");o&&(o.onsubmit=async r=>{r.preventDefault();const s=e.querySelector("#login-email").value,c=e.querySelector("#login-password").value;s&&c?t(s):S.show("Preencha e-mail e senha para continuar.","error")})}},ae="admin@catalogopro.com";async function oe(){var o;(localStorage.getItem("theme")==="dark"||!localStorage.getItem("theme")&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.classList.add("dark");const e=document.getElementById("app");if(!e)return;const i=new URLSearchParams(window.location.search).get("page");if(i==="login"){e.innerHTML=Y.render(),Y.bindEvents(e);return}if(i==="admin"){let r=null;try{}catch(d){console.warn("Supabase Auth indisponível:",d.message)}let s=null;try{const d=localStorage.getItem("admin_auth");d&&(s=JSON.parse(d))}catch{}if(!r&&!(s!=null&&s.authenticated)){window.location.search="?page=login";return}if(((o=r==null?void 0:r.user)==null?void 0:o.email)===ae||(s==null?void 0:s.role)==="superadmin"){async function d(){e.innerHTML=await K.render(),K.bindEvents(e,()=>d())}await d()}else{await P.initTenant();async function d(){e.innerHTML=await Q.render(),Q.bindEvents(e,()=>d())}await d()}return}if(i==="portal"){e.innerHTML=await J.render(),J.bindEvents(e);return}await P.initTenant(),await se(e)}async function se(e){const t=P.getState().tenant||{store_name:"Catálogo Pro",logo_url:null},i=t!=null&&t.logo_url?`<img src="${t.logo_url}" class="h-9 w-auto object-contain" alt="${t.store_name||"Logo"}" />`:`
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-xl bg-lojaPrimaria text-white flex items-center justify-center font-black text-sm shadow-md shadow-lojaPrimaria/30">CP</span>
        <span class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">${(t==null?void 0:t.store_name)||"Catálogo Pro"}</span>
      </div>
    `;e.innerHTML=`
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <a href="/" class="hover:opacity-90 transition">${i}</a>
          <span class="hidden md:inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Vitrine Online
          </span>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Link Painel Admin -->
          <a href="/?page=admin" class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-lojaPrimaria dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Painel Admin
          </a>

          <!-- Alternador de Dark Mode -->
          <button id="theme-toggle-btn" class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition" title="Alternar Modo Escuro">
            <svg id="theme-icon-sun" class="w-5 h-5 hidden dark:block text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg id="theme-icon-moon" class="w-5 h-5 block dark:hidden text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Botão da Sacola / Carrinho -->
          <button id="floating-cart-trigger" class="bg-lojaPrimaria text-white px-4 md:px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-lojaPrimaria/25 transition-all active:scale-95 hover:opacity-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline">Sacola</span>
            <span id="cart-counter-slot" class="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">0</span>
          </button>
        </div>
      </div>
    </header>

    <div id="home-view-container"></div>
    <div id="cart-drawer-container"></div>
    <div id="checkout-modal-container"></div>
    <div id="product-modal-container"></div>
  `;const o=document.getElementById("theme-toggle-btn");o&&(o.onclick=()=>{const n=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",n?"dark":"light")});const r=document.getElementById("home-view-container"),s=document.getElementById("cart-drawer-container"),c=document.getElementById("checkout-modal-container"),d=document.getElementById("cart-counter-slot");async function y(){const{cart:n}=P.getState(),b=parseInt((d==null?void 0:d.innerText)||"0"),x=n.reduce((u,h)=>u+h.quantity,0);if(d&&(d.innerText=x,x>b)){const u=document.getElementById("floating-cart-trigger");u==null||u.classList.add("scale-110"),setTimeout(()=>u==null?void 0:u.classList.remove("scale-110"),300)}s.innerHTML=M.render(),M.bindEvents(s,()=>O.open()),c.innerHTML=O.render(),O.bindEvents(c,async u=>{const{tenant:h}=P.getState();(await re.createOrder({...u,cartItems:n,tenant:h})).success&&(O.close(),P.clearCart())})}r.innerHTML=await X.render(),X.bindEvents(r),window.addEventListener("global:add-to-cart",async n=>{const{id:b,quantity:x,size:u,color:h,option1:k,option2:p}=n.detail,l=await z.getById(b);l&&(P.addToCart(l,x||1,{size:u,color:h,option1:k,option2:p}),M.open())});const f=document.getElementById("floating-cart-trigger");f&&(f.onclick=()=>M.open()),P.subscribe(()=>y()),await y()}oe();
