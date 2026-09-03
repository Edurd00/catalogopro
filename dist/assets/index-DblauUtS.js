(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const N=(e,r)=>{const s=document.documentElement;e&&(s.style.setProperty("--color-primary",e),s.style.setProperty("--cor-primaria",e)),r&&(s.style.setProperty("--color-secondary",r),s.style.setProperty("--cor-secondary",r))},w=null;class Z{constructor(){this.state={tenant:null,cart:JSON.parse(localStorage.getItem("cart"))||[],listeners:[]}}subscribe(r){return this.state.listeners.push(r),()=>{this.state.listeners=this.state.listeners.filter(s=>s!==r)}}notify(){this.state.listeners.forEach(r=>r(this.getState()))}getState(){return{tenant:this.state.tenant,cart:this.state.cart}}async initTenant(){try{if(!w){this.state.tenant||(this.state.tenant={store_name:"Catálogo Pro",primary_color:"#3b82f6",secondary_color:"#1e3a8a",whatsapp_number:"5511999999999"},N(this.state.tenant.primary_color,this.state.tenant.secondary_color));return}const r=new URLSearchParams(window.location.search),s=r.get("store"),a=r.get("page")==="admin";let t=w.from("tenant_settings").select("*");if(s)t=t.eq("slug",s).maybeSingle();else if(a){const{data:{session:u}}=await w.auth.getSession();if(u!=null&&u.user){if(u.user.email==="admin@catalogopro.com")return;t=t.eq("owner_id",u.user.id).maybeSingle()}else return}else return;const{data:i,error:d}=await t;if(d){console.warn("Erro ao carregar tenant:",d.message);return}i&&(this.state.tenant=i,N(i.primary_color,i.secondary_color),this.notify())}catch(r){console.warn("Erro ao inicializar tenant:",r.message)}}setTenant(r){this.state.tenant=r,r&&N(r.primary_color,r.secondary_color),this.state.cart=[],localStorage.removeItem("cart"),this.notify()}addToCart(r,s=1,a={}){const t=`${r.id}-${btoa(JSON.stringify(a))}`,i=this.state.cart.findIndex(d=>d.cartItemId===t);i>-1?this.state.cart[i].quantity+=s:this.state.cart.push({cartItemId:t,product:r,quantity:s,selectedAttributes:a}),this.saveCart()}removeFromCart(r){this.state.cart=this.state.cart.filter(s=>s.cartItemId!==r),this.saveCart()}clearCart(){this.state.cart=[],this.saveCart()}saveCart(){localStorage.setItem("cart",JSON.stringify(this.state.cart)),this.notify()}}const A=new Z,E={show(e,r="success"){const s=document.getElementById("toast-container")||this.createContainer(),a=document.createElement("div"),t=r==="success"?"bg-green-50":"bg-red-50",i=r==="success"?"border-green-200":"border-red-200",d=r==="success"?"text-green-800":"text-red-800",u=r==="success"?'<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>':'<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';a.className=`flex items-center gap-3 ${t} ${i} border ${d} px-6 py-4 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top duration-300 min-w-[300px]`,a.innerHTML=`
      <div class="flex-shrink-0">${u}</div>
      <p class="text-sm font-bold uppercase tracking-tight">${e}</p>
    `,s.appendChild(a),setTimeout(()=>{a.classList.replace("animate-in","animate-out"),a.classList.add("fade-out","duration-500"),setTimeout(()=>a.remove(),500)},4e3)},createContainer(){const e=document.createElement("div");return e.id="toast-container",e.className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-[90vw] md:max-w-md items-center",document.body.appendChild(e),e}},U={render(e,r={}){var f;const s=r.opt1Label||"Opções",a=r.opt2Label||"Variações",t=e.promo_price&&Number(e.promo_price)<Number(e.price),i=t?e.promo_price:e.price,d=t?Math.round((Number(e.price)-Number(e.promo_price))/Number(e.price)*100):0,u=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),y=[];return e.image_url&&y.push(e.image_url),Array.isArray(e.image_urls)&&e.image_urls.forEach(n=>{n&&!y.includes(n)&&y.push(n)}),y.length===0&&y.push("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000"),`
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
                ${y.map((n,g)=>`
                  <button class="js-thumb w-10 h-10 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${g===0?"border-white shadow-lg scale-110":"border-transparent opacity-60 hover:opacity-90"}" data-index="${g}" onclick="window.modalSwitchImage(${g})">
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
            ${t?`
              <div class="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-md">
                -${d}% OFF
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
                    ${u(i)}
                  </span>
                  ${t?`
                    <span class="text-sm text-gray-400 line-through font-bold">${u(e.price)}</span>
                    <span class="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-lg">
                      Economize ${u(Number(e.price)-Number(e.promo_price))}
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
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${s}</span>
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
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">${a}</span>
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
    `},bindEvents(e,r,s,a={}){const t=a.opt1Label||"Opções",i=a.opt2Label||"Variações",d=e.querySelector("#product-modal-root"),u=e.querySelector("#close-product-modal"),y=e.querySelector("#modal-backdrop"),f=e.querySelector("#qty-input"),n=e.querySelector("#qty-plus"),g=e.querySelector("#qty-minus"),m=e.querySelector("#modal-add-to-cart"),c=e.querySelector("#buy-now-whatsapp");let b=null,$=null;window.modalSwitchImage=l=>{const o=e.querySelector("#modal-main-img"),x=e.querySelectorAll(".js-thumb"),h=[];r.image_url&&h.push(r.image_url),Array.isArray(r.image_urls)&&r.image_urls.forEach(v=>{v&&!h.includes(v)&&h.push(v)}),o&&h[l]&&(o.style.opacity="0",o.style.transition="opacity 0.2s",setTimeout(()=>{o.src=h[l],o.style.opacity="1"},200)),x.forEach((v,k)=>{v.classList.toggle("border-white",k===l),v.classList.toggle("scale-110",k===l),v.classList.toggle("opacity-60",k!==l),v.classList.toggle("border-transparent",k!==l)})};const j=()=>{d==null||d.classList.add("animate-out","fade-out","zoom-out","duration-200"),setTimeout(()=>d==null?void 0:d.remove(),200)};u==null||u.addEventListener("click",j),y==null||y.addEventListener("click",l=>{l.target===y&&j()}),document.addEventListener("keydown",function l(o){o.key==="Escape"&&(j(),document.removeEventListener("keydown",l))}),n==null||n.addEventListener("click",()=>{f.value=parseInt(f.value)+1}),g==null||g.addEventListener("click",()=>{parseInt(f.value)>1&&(f.value=parseInt(f.value)-1)}),e.querySelectorAll(".js-color-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".js-color-btn").forEach(x=>{x.classList.remove("bg-lojaPrimaria","text-white","border-lojaPrimaria"),x.classList.add("border-gray-200","dark:border-gray-700","text-gray-600")}),l.classList.remove("border-gray-200","dark:border-gray-700","text-gray-600"),l.classList.add("bg-lojaPrimaria","text-white","border-lojaPrimaria"),$=l.getAttribute("data-color");const o=e.querySelector("#selected-color-label");o&&(o.textContent=$,o.classList.remove("opacity-0"))})}),e.querySelectorAll(".js-attr-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".js-attr-btn").forEach(x=>{x.classList.remove("bg-lojaPrimaria","text-white","border-lojaPrimaria"),x.classList.add("border-gray-200","dark:border-gray-700","text-gray-600")}),l.classList.remove("border-gray-200","dark:border-gray-700","text-gray-600"),l.classList.add("bg-lojaPrimaria","text-white","border-lojaPrimaria"),b=l.getAttribute("data-attr");const o=e.querySelector("#selected-attr-label");o&&(o.textContent=b,o.classList.remove("opacity-0"))})}),m==null||m.addEventListener("click",()=>{var l,o,x,h;if(((l=r.colors)==null?void 0:l.length)>0&&!$){E.show(`Selecione ${t.toLowerCase()} para continuar`,"error"),(o=e.querySelectorAll(".js-color-btn")[0])==null||o.classList.add("ring-2","ring-red-400");return}if(((x=r.attributes)==null?void 0:x.length)>0&&!b){E.show(`Selecione ${i.toLowerCase()} para continuar`,"error"),(h=e.querySelectorAll(".js-attr-btn")[0])==null||h.classList.add("ring-2","ring-red-400");return}s({quantity:parseInt(f.value),size:b,color:$,option1:$,option2:b}),E.show("Produto adicionado ao carrinho! 🛒"),j()}),c==null||c.addEventListener("click",()=>{const l=A.getState().tenant,x=((l==null?void 0:l.whatsapp_number)||"5511999999999").replace(/\D/g,""),v=[`Olá! Tenho interesse no produto: *${r.name||r.title||"Produto"}*`];$&&v.push(`${t}: ${$}`),b&&v.push(`${i}: ${b}`),v.push(`Quantidade: ${f.value}`);const k=v.join(`
`);window.open(`https://wa.me/${x}?text=${encodeURIComponent(k)}`,"_blank")})}},G=[{id:1,name:"Eletrônicos & Tech",description:"Gadgets de última geração, áudio de alta fidelidade e tecnologia para o dia a dia."},{id:2,name:"Moda & Vestuário",description:"Roupas modernas, tecidos premium e peças essenciais para o seu estilo."},{id:3,name:"Calçados & Sneakers",description:"Tênis urbanos, casuais e esportivos com design exclusivo e máximo conforto."},{id:4,name:"Acessórios & Estilo",description:"Relógios, mochilas e óculos para complementar seu visual em qualquer ocasião."},{id:5,name:"Casa & Decoração",description:"Itens minimalistas e funcionais para transformar o seu ambiente de trabalho ou casa."}],ee=[{id:1,category_id:1,name:"Headphone Bluetooth Noise Cancelling Pro",description:"Cancelamento ativo de ruído híbrido, drivers de 40mm de titânio e autonomia de até 35 horas de reprodução contínua.",price:489.9,promo_price:399.9,image_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",stock_quantity:18,is_active:!0},{id:2,category_id:1,name:"Smartwatch AMOLED Ultra Fit",description:'Tela Always-on AMOLED de 1.43", monitoramento cardíaco contínuo, GPS integrado e resistência à água de 5ATM.',price:359,promo_price:299,image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",stock_quantity:25,is_active:!0},{id:3,category_id:1,name:"Teclado Mecânico Wireless RGB Compact",description:"Switches táteis hot-swappable, conectividade Tri-Mode (Bluetooth, 2.4GHz e USB-C) e iluminação RGB programável.",price:320,promo_price:null,image_url:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",stock_quantity:12,is_active:!0},{id:4,category_id:1,name:"Caixa de Som Portátil Waterproof 30W",description:"Som envolvente de 360 graus, graves potentes com radiadores passivos duplos e certificação IPX7 à prova dágua.",price:229.9,promo_price:189.9,image_url:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",stock_quantity:30,is_active:!0},{id:5,category_id:2,name:"Camiseta Oversized Minimalist Algodão Egípcio",description:"Modelagem boxy moderna, 100% algodão penteado de alta gramatura (240g) com toque super macio e caimento impecável.",price:119.9,promo_price:89.9,image_url:"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",stock_quantity:45,is_active:!0},{id:6,category_id:2,name:"Jaqueta Corta-Vento Urban Techwear",description:"Tecido impermeável e corta-vento com detalhes refletivos, capuz ergonômico ajustável e bolsos selados térmicos.",price:279,promo_price:239,image_url:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",stock_quantity:15,is_active:!0},{id:7,category_id:2,name:"Moletom Hoodie Heavyweight Essential",description:"Interior felpado ultra quente, costuras reforçadas pespontadas e corte unissex premium para dias mais frios.",price:199.9,promo_price:null,image_url:"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",stock_quantity:20,is_active:!0},{id:8,category_id:3,name:"Sneaker Retro Runner Casual Branco & Vermelho",description:"Inspirado nos clássicos do street style dos anos 90, com entressola em EVA macio e cabedal de couro legítimo camurçado.",price:389.9,promo_price:329.9,image_url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",stock_quantity:14,is_active:!0},{id:9,category_id:3,name:"Tênis Running Performance CloudFly",description:"Amortecimento responsivo de alta absorção de impacto, cabedal em malha respirável knit sem costuras.",price:449,promo_price:379,image_url:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",stock_quantity:22,is_active:!0},{id:10,category_id:3,name:"Bota Coturno Couro Legitimo Urban Black",description:"Solado tratorado em borracha antiderrapante com vira costurada Goodyear welted para máxima durabilidade.",price:349.9,promo_price:null,image_url:"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",stock_quantity:10,is_active:!0},{id:11,category_id:4,name:"Mochila Impermeável SafeRoll 25L",description:'Compartimento acolchoado para notebook de até 16", zíperes anti-furto selados e tecido resistente à abrasão.',price:249.9,promo_price:199.9,image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",stock_quantity:16,is_active:!0},{id:12,category_id:4,name:"Óculos de Sol Acetato Polarizado Classic",description:"Lentes com 100% de proteção UV400, armação artesanal em acetato preto fosco e dobradiças reforçadas de metal.",price:169.9,promo_price:139.9,image_url:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",stock_quantity:28,is_active:!0},{id:13,category_id:4,name:"Relógio Minimalista Cronógrafo All-Black",description:"Mecanismo quartzo japonês de precisão, pulseira de aço inoxidável em malha milanesa e vidro safira resistente a riscos.",price:289,promo_price:null,image_url:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",stock_quantity:15,is_active:!0},{id:14,category_id:5,name:"Luminária de Mesa Articulada LED Smart",description:"Controle touch de temperatura de cor (quente, neutra, fria) e dimerização gradual com porta de carregamento USB integrada.",price:159.9,promo_price:129.9,image_url:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",stock_quantity:20,is_active:!0},{id:15,category_id:5,name:"Garrafa Térmica Inox Vacuum 750ml",description:"Isolamento térmico à vácuo de parede dupla que mantém bebidas geladas por 24h e quentes por 12h sem condensação externa.",price:89.9,promo_price:69.9,image_url:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",stock_quantity:40,is_active:!0}],R={async getCategories(){try{}catch{}return G},async getProducts({categoryId:e=null,searchQuery:r="",orderBy:s="featured"}={}){let a=null;if(!a)try{}catch{}if(a||(a=ee.map(t=>{const i=G.find(d=>d.id===t.category_id);return{...t,title:t.name,categories:{name:i?i.name:"Geral"}}})),e&&(a=a.filter(t=>String(t.category_id)===String(e))),r){const t=r.toLowerCase();a=a.filter(i=>i.name&&i.name.toLowerCase().includes(t)||i.title&&i.title.toLowerCase().includes(t)||i.description&&i.description.toLowerCase().includes(t))}return s==="asc"?a.sort((t,i)=>Number(t.price)-Number(i.price)):s==="desc"&&a.sort((t,i)=>Number(i.price)-Number(t.price)),a},async getProductById(e){return(await this.getProducts()).find(s=>String(s.id)===String(e))||null}},Y={async getProducts({categoryId:e,searchQuery:r,orderBy:s="featured"}={}){return await R.getProducts({categoryId:e,searchQuery:r,orderBy:s})},async getById(e){return await R.getProductById(e)}},te={async getAllActive(){try{return await R.getCategories()||[]}catch(e){return console.error("Erro no categoryService.getAllActive:",e.message),[]}}},W={selectedCategoryId:null,searchQuery:"",allProducts:[],categories:[],tenant:null,async render(){try{const r=new URLSearchParams(window.location.search).get("store");let s=null;try{}catch{}const a=s||{store_name:"Catálogo Pro",hero_title:"Catálogo Digital & Delivery",hero_subtitle:"Explore produtos exclusivos e finalize seu pedido diretamente pelo WhatsApp",hero_image_url:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",whatsapp_number:"5511999999999",primary_color:"#3b82f6",secondary_color:"#1e3a8a",address:"São Paulo, SP - Atendimento Online"},[t,i]=await Promise.all([Y.getProducts(),te.getAllActive()]);this.allProducts=t||[],this.categories=i||[],this.tenant=a;const d=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),u=a.hero_image_url?`style="background: linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url('${a.hero_image_url}'); background-size: cover; background-position: center;"`:'class="bg-gradient-to-br from-lojaPrimaria to-lojaSecundaria"',f=`
        <a href="https://wa.me/${(a.whatsapp_number||"5511999999999").replace(/\D/g,"")}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20cat%C3%A1logo." target="_blank" class="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.52.909 3.284 1.389 5.083 1.391 5.446.002 9.879-4.431 9.882-9.88.001-2.641-1.03-5.124-2.903-6.999-1.872-1.875-4.355-2.908-6.998-2.908-5.448 0-9.881 4.432-9.884 9.881-.001 1.838.513 3.633 1.488 5.191l-.991 3.616 3.702-.972zm10.177-6.238c-.276-.138-1.636-.808-1.89-.9-.252-.092-.437-.138-.62.138-.184.276-.712.9-.873 1.084-.159.184-.32.207-.597.069-.276-.138-1.169-.431-2.227-1.374-.824-.735-1.644-1.921-.154-1.921-.161-.276-.017-.425.12-.563.125-.124.276-.322.415-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.495-.85-2.046-.224-.541-.47-.466-.645-.475-.165-.008-.354-.01-.543-.01s-.497.071-.757.345c-.26.274-1 1.009-1 2.459s1.055 2.846 1.203 3.045c.148.199 2.077 3.172 5.031 4.449.703.304 1.252.486 1.679.622.705.226 1.348.194 1.856.118.566-.085 1.636-.669 1.865-1.315.23-.647.23-1.201.161-1.315-.069-.115-.253-.207-.529-.345z"/>
          </svg>
          <span class="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">Fale Conosco</span>
        </a>
      `;return`
        <!-- HERO BANNER -->
        <section class="relative w-full h-[360px] md:h-[460px] flex items-center justify-center text-center px-4" ${u.startsWith("style")?u:""} ${u.startsWith("class")?u:""}>
          <div class="max-w-4xl mx-auto space-y-4 relative z-10 text-white animate-in fade-in slide-in-from-bottom duration-700">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Vitrine Online • Catálogo Interativo
            </div>
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              ${a.hero_title||"Catálogo Pro"}
            </h1>
            <p class="text-sm md:text-lg font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
              ${a.hero_subtitle||"Escolha seus itens favoritos e finalize sua compra facilmente."}
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
              ${this.categories.map(n=>{const g=this.allProducts.filter(c=>String(c.category_id)===String(n.id)).length,m=String(this.selectedCategoryId)===String(n.id);return`
                  <button data-category-id="${n.id}" class="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border ${m?"bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20":"bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}">
                    ${n.name} ${g>0?`(${g})`:""}
                  </button>
                `}).join("")}
            </div>
          </section>

          <!-- GRID DE PRODUTOS -->
          <section id="products-grid-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
            ${this.renderProductsHTML(this.allProducts,d)}
          </section>
        </main>

        <!-- RODAPÉ MODERNO -->
        <footer class="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-12 pb-20 mt-16">
          <div class="max-w-4xl mx-auto px-4 text-center space-y-6">
            <div class="space-y-2">
              <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">${a.store_name}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto font-medium">
                Catálogo digital otimizado de alta performance integrado ao PostgreSQL Neon e WhatsApp.
              </p>
            </div>

            ${a.address?`
              <div class="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${a.address}</span>
              </div>
            `:""}

            <div class="flex items-center justify-center gap-6 text-xs font-black text-gray-400 uppercase tracking-widest pt-2">
              <a href="#" class="hover:text-lojaPrimaria transition">Início</a>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <a href="/?page=admin" class="hover:text-lojaPrimaria transition">Painel Admin</a>
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              © ${new Date().getFullYear()} ${a.store_name} • Desenvolvido para Portfólio
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
      `}},renderProductsHTML(e,r){let s=e;if(this.selectedCategoryId&&(s=s.filter(a=>String(a.category_id)===String(this.selectedCategoryId))),this.searchQuery){const a=this.searchQuery.toLowerCase().trim();s=s.filter(t=>{const i=(t.name||t.title||"").toLowerCase(),d=(t.description||"").toLowerCase();return i.includes(a)||d.includes(a)})}return s.length===0?`
        <div class="col-span-full py-20 text-center space-y-4">
          <div class="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200">Nenhum produto encontrado</h4>
          <p class="text-gray-500 text-xs">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      `:s.map(a=>{var g;const t=a.name||a.title||"Produto",i=Number(a.price),d=a.promo_price?Number(a.promo_price):null,u=d&&d<i,y=u?Math.round((i-d)/i*100):0,f=u?d:i,n=a.stock_quantity!==void 0&&a.stock_quantity<=0;return`
        <div class="js-product-card group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full relative animate-in fade-in" data-id="${a.id}">

          ${u?`
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
              src="${a.image_url||"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="${t}"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';"
            />
          </div>

          <div class="p-3.5 md:p-4 flex flex-col flex-grow">
            <span class="text-[9px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
              ${((g=a.categories)==null?void 0:g.name)||"Geral"}
            </span>
            <h3 class="font-bold text-gray-800 dark:text-white text-xs md:text-sm line-clamp-2 mb-2 flex-grow leading-snug">
              ${t}
            </h3>
            
            <div class="flex flex-col mt-auto pt-2">
              <div class="flex items-baseline gap-1.5 flex-wrap">
                ${u?`<span class="text-[10px] text-gray-400 line-through">R$ ${i.toFixed(2)}</span>`:""}
                <span class="text-sm md:text-lg font-black ${u?"text-red-600":"text-gray-900 dark:text-white"}">
                  ${r(f)}
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
      `}).join("")},bindEvents(e){const r=a=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(a),s=e.querySelector("#search-input");s&&(s.oninput=a=>{this.searchQuery=a.target.value;const t=e.querySelector("#products-grid-container");t&&(t.innerHTML=this.renderProductsHTML(this.allProducts,r),this.bindCardEvents(e))}),e.querySelectorAll(".js-category-btn").forEach(a=>{a.onclick=()=>{const t=a.dataset.categoryId;this.selectedCategoryId=t==="all"?null:t,e.querySelectorAll(".js-category-btn").forEach(d=>{d.className="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"}),a.className="js-category-btn whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition border bg-lojaPrimaria text-white border-lojaPrimaria shadow-md shadow-lojaPrimaria/20";const i=e.querySelector("#products-grid-container");i&&(i.innerHTML=this.renderProductsHTML(this.allProducts,r),this.bindCardEvents(e))}}),this.bindCardEvents(e)},bindCardEvents(e){e.querySelectorAll(".js-product-card").forEach(r=>{r.onclick=s=>{if(s.target.closest(".js-quick-add"))return;const a=r.dataset.id,t=this.allProducts.find(d=>String(d.id)===String(a)),i=document.getElementById("product-modal-container");i&&t&&(i.innerHTML=U.render(t),U.bindEvents(i,t,d=>{window.dispatchEvent(new CustomEvent("global:add-to-cart",{detail:{id:t.id,...d}}))}))}}),e.querySelectorAll(".js-quick-add").forEach(r=>{r.onclick=s=>{s.stopPropagation();const a=r.closest(".js-product-card");a&&a.dataset.id&&(window.dispatchEvent(new CustomEvent("global:add-to-cart",{detail:{id:a.dataset.id}})),E.show("Produto adicionado ao carrinho! 🛒"))}})}},Q={async render(){try{const{data:e,error:r}=await w.from("tenant_settings").select("id, store_name, slug, logo_url, hero_image_url, hero_title, hero_subtitle, whatsapp_number, primary_color").order("store_name",{ascending:!0});if(r)throw r;const s=e||[];return`
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
                <p class="text-3xl font-black text-white">${s.length}</p>
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
              ${this.renderStores(s)}
            </div>

            ${s.length===0?`
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
      `}},renderStores(e){return e.length?e.map(r=>{const s=r.slug||r.id,a=r.hero_image_url?`style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('${r.hero_image_url}'); background-size: cover; background-position: center;"`:`style="background: linear-gradient(135deg, ${r.primary_color||"#6d28d9"}33, ${r.primary_color||"#6d28d9"}11);"`;return`
        <a href="/?store=${s}" class="js-store-card group relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-900/30 block" data-name="${(r.store_name||"").toLowerCase()}">
          <div class="h-52 flex flex-col justify-between p-6" ${a}>
            <div class="flex items-start justify-between">
              ${r.logo_url?`<img src="${r.logo_url}" class="h-12 w-12 rounded-2xl object-cover border-2 border-white/20 shadow-lg" onerror="this.style.display='none'" />`:`<div class="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white" style="background:${r.primary_color||"#6d28d9"}44">${(r.store_name||"?").charAt(0).toUpperCase()}</div>`}
              <span class="text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/10">
                Aberta
              </span>
            </div>
            <div>
              <h3 class="text-lg font-black text-white leading-tight group-hover:text-violet-200 transition">${r.store_name||s}</h3>
              ${r.hero_subtitle?`<p class="text-xs text-white/60 mt-1 line-clamp-1">${r.hero_subtitle}</p>`:""}
            </div>
          </div>
          <div class="bg-white/[0.03] border-t border-white/5 px-6 py-4 flex items-center justify-between">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">/${s}</span>
            <span class="text-[10px] font-black text-violet-400 uppercase tracking-widest group-hover:text-violet-300 flex items-center gap-1 transition">
              Visitar
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </a>
      `}).join(""):""},bindEvents(e){const r=e.querySelector("#portal-search");r&&(r.oninput=s=>{const a=s.target.value.toLowerCase().trim();e.querySelectorAll(".js-store-card").forEach(t=>{const i=t.dataset.name||"";t.style.display=i.includes(a)?"":"none"})})}},M={isOpen:!1,render(){const{cart:e,tenant:r}=A.getState(),s=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),a=e.reduce((n,g)=>{const m=g.product.promo_price&&g.product.promo_price<g.product.price?g.product.promo_price:g.product.price;return n+m*g.quantity},0),t=r!=null&&r.delivery_fee?Number(r.delivery_fee):0,i=e.reduce((n,g)=>{var c;const m=Number(((c=g.product)==null?void 0:c.shipping_fee)||0);return m>n?m:n},0),d=i>0?i:t,u=a+d,y=this.isOpen?"":"hidden opacity-0",f=this.isOpen?"translate-x-0":"translate-x-full";return`
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
            `:e.map(n=>{const g=n.product.promo_price&&n.product.promo_price<n.product.price?n.product.promo_price:n.product.price,m=Object.entries(n.selectedAttributes).map(([c,b])=>`${c}: ${b}`).join(", ");return`
                  <div class="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-50">
                      <img src="${n.product.image_url||""}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100'" />
                    </div>
                    <div class="flex-grow flex flex-col justify-between py-0.5">
                      <div>
                        <h4 class="text-sm font-bold text-gray-900 line-clamp-1">${n.product.name||n.product.title}</h4>
                        ${m?`<p class="text-[10px] text-lojaPrimaria font-black uppercase tracking-widest mt-1">${m}</p>`:""}
                      </div>
                      <div class="flex justify-between items-center mt-2">
                        <span class="text-sm font-black text-gray-900">${s(g*n.quantity)}</span>
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
                  <span class="text-gray-900">${s(a)}</span>
                </div>
                <div class="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Entrega</span>
                  <span class="text-green-600">${d===0?"Grátis":s(d)}</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span class="text-lg font-black text-gray-900 uppercase tracking-tight">Total</span>
                  <span class="text-xl font-black text-lojaPrimaria">${s(u)}</span>
                </div>
              </div>
              
              <button id="go-to-checkout" class="w-full bg-lojaPrimaria text-white font-black py-4 rounded-2xl shadow-lg shadow-lojaPrimaria/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
                Finalizar Pedido
              </button>
            </div>
          `:""}

        </div>
      </div>
    `},open(){this.isOpen=!0;const e=document.getElementById("cart-overlay"),r=document.getElementById("cart-panel");!e||!r||(e.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),r.classList.remove("translate-x-full")},10))},close(){this.isOpen=!1;const e=document.getElementById("cart-overlay"),r=document.getElementById("cart-panel");!e||!r||(e.classList.add("opacity-0"),r.classList.add("translate-x-full"),setTimeout(()=>e.classList.add("hidden"),300))},bindEvents(e,r){const s=e.querySelector("#close-cart"),a=e.querySelector("#cart-overlay"),t=e.querySelector("#cart-panel"),i=e.querySelector("#go-to-checkout");s&&(s.onclick=()=>this.close()),a&&(a.onclick=d=>{d.target.id==="cart-overlay"&&this.close()}),t&&(t.onclick=d=>d.stopPropagation()),i&&r&&(i.onclick=()=>{this.close(),r()}),e.querySelectorAll(".js-cart-inc").forEach(d=>{d.onclick=u=>{u.stopPropagation();const y=d.getAttribute("data-id"),{cart:f}=A.getState(),n=f.find(g=>g.cartItemId===y);n&&A.addToCart(n.product,1,n.selectedAttributes)}}),e.querySelectorAll(".js-cart-dec").forEach(d=>{d.onclick=u=>{u.stopPropagation();const y=d.getAttribute("data-id"),{cart:f}=A.getState(),n=f.find(g=>g.cartItemId===y);n&&(n.quantity>1?A.addToCart(n.product,-1,n.selectedAttributes):A.removeFromCart(y))}})}},O={render(){const{cart:e,tenant:r}=A.getState(),s=f=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(f),a=r!=null&&r.delivery_fee?parseFloat(r.delivery_fee):0,t=e.reduce((f,n)=>{var m;const g=parseFloat(((m=n.product)==null?void 0:m.shipping_fee)||0);return g>f?g:f},0),i=t>0?t:a,d=e.reduce((f,n)=>{const g=n.product||{},m=g.promo_price&&g.promo_price<g.price?Number(g.promo_price):Number(g.price||0),c=Number(n.quantity)||1;return f+m*c},0),u=d+i,y=i>0?s(i):'<span class="text-green-600 font-extrabold">A combinar / Grátis 💬</span>';return`
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
              <span class="font-medium text-gray-800">${s(d)}</span>
            </div>
            <div class="flex justify-between text-gray-600 items-center">
              <span>Taxa de Entrega:</span>
              <span class="font-medium text-gray-800">${y}</span>
            </div>
            <div class="flex justify-between text-base font-black text-gray-900 border-t pt-2 mt-1">
              <span>Total Geral:</span>
              <span>${s(u)}</span>
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
    `},open(){var r;const e=document.getElementById("checkout-modal-container");e&&(e.innerHTML=this.render(),this.bindEvents(e,window.currentCheckoutCallback||(()=>{}))),(r=document.getElementById("checkout-modal"))==null||r.classList.remove("hidden")},close(){var e;(e=document.getElementById("checkout-modal"))==null||e.classList.add("hidden")},bindEvents(e,r){const s=e.querySelector("#close-checkout"),a=e.querySelector("#checkout-form");window.currentCheckoutCallback=r,s&&(s.onclick=()=>this.close()),a&&(a.onsubmit=t=>{t.preventDefault();const i={customerName:e.querySelector("#form-name").value,customerPhone:e.querySelector("#form-phone").value,deliveryAddress:e.querySelector("#form-address").value,paymentMethod:e.querySelector("#form-payment").value};r(i)})}},re={async createOrder({customerName:e,customerPhone:r,deliveryAddress:s,paymentMethod:a,cartItems:t,tenant:i}){try{const d=l=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(l),u=i!=null&&i.delivery_fee?Number(i.delivery_fee):0,y=t.reduce((l,o)=>{var h;const x=o.shipping_fee??((h=o.product)==null?void 0:h.shipping_fee)??0;return x>l?x:l},0),f=y>0?y:u,n=t.reduce((l,o)=>{const x=o.product||o,h=x.promo_price&&Number(x.promo_price)<Number(x.price)?Number(x.promo_price):Number(x.price||0);return l+h*o.quantity},0),g=n+f;let m="ORD-"+Date.now();try{}catch(l){console.warn("Persistência opcional de pedido não concluída (tabelas orders podem não existir):",l.message)}let c=`*📦 NOVO PEDIDO RECEBIDO (#${m})*
`;c+=`----------------------------------------
`,c+=`*Cliente:* ${e}
`,c+=`*Telefone:* ${r}
`,c+=`----------------------------------------
`,c+=`*🛒 ITENS DO PEDIDO:*
`,t.forEach(l=>{var v,k;const o=l.product||l,x=o.name||o.title||"Produto",h=o.promo_price&&Number(o.promo_price)<Number(o.price)?Number(o.promo_price):Number(o.price||0);c+=`${l.quantity}x ${x} - ${d(h)}
`,(v=l.selectedAttributes)!=null&&v.size&&(c+=`- Tamanho/Opção: ${l.selectedAttributes.size}
`),(k=l.selectedAttributes)!=null&&k.color&&(c+=`- Cor/Variação: ${l.selectedAttributes.color}
`)}),c+=`----------------------------------------
`,c+=`*💰 RESUMO DOS VALORES:*
`,c+=`Subtotal: ${d(n)}
`,c+=`Taxa de Entrega: ${f===0?"Grátis / A combinar":d(f)}
`,c+=`*TOTAL DO PEDIDO: ${d(g)}*
`,c+=`----------------------------------------
`,c+=`*📍 DADOS DE ENTREGA / PAGAMENTO:*
`,c+=`Forma de Pagamento: ${a}
`,c+=`Tipo: ${s?"Delivery":"Retirada"}
`,c+=`Endereço: ${s||"Retirada no Local"}
`;const j=`https://wa.me/${((i==null?void 0:i.whatsapp_number)||"5511999999999").replace(/\D/g,"")}?text=${encodeURIComponent(c)}`;return window.open(j,"_blank"),E.show("Pedido gerado com sucesso! Redirecionando para o WhatsApp... 🚀"),{success:!0,orderId:m}}catch(d){return console.error("Erro ao gerar pedido:",d),E.show("Erro ao processar pedido.","error"),{success:!1}}}},D={render(e,r="",s="Carregar Imagem"){return`
      <div class="space-y-2" id="container-${e}">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">${s}</label>
        <div class="flex items-center gap-4">
          <div class="relative w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group">
            ${r?`<img src="${r}" id="preview-${e}" class="w-full h-full object-cover" />`:`<div id="placeholder-${e}" class="text-gray-300">
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
            <input type="hidden" id="url-${e}" value="${r}" />
          </div>
        </div>
      </div>
    `},async compressImage(e){return new Promise(r=>{const s=new FileReader;s.readAsDataURL(e),s.onload=a=>{const t=new Image;t.src=a.target.result,t.onload=()=>{const i=document.createElement("canvas"),d=1080;let u=t.width,y=t.height;u>d&&(y=Math.round(y*d/u),u=d),i.width=u,i.height=y,i.getContext("2d").drawImage(t,0,0,u,y),i.toBlob(n=>{r(n)},"image/jpeg",.75)}}})},bindEvents(e,r){const s=document.getElementById(`input-${e}`),a=document.getElementById(`loading-${e}`),t=document.getElementById(`container-${e}`).querySelector(".relative"),i=document.getElementById(`url-${e}`),d=document.getElementById(`progress-container-${e}`),u=document.getElementById(`progress-bar-${e}`);s&&(s.onchange=async y=>{const f=y.target.files[0];if(f){a.classList.remove("hidden"),a.classList.add("flex"),d.classList.remove("hidden"),u.style.width="20%";try{const n=await this.compressImage(f);u.style.width="50%";const m=`uploads/${`${Math.random().toString(36).substring(2)}.jpg`}`,{error:c}=await w.storage.from("loja").upload(m,n);if(c)throw c;u.style.width="100%";const{data:{publicUrl:b}}=w.storage.from("loja").getPublicUrl(m);i.value=b,t.innerHTML=`
            <img src="${b}" id="preview-${e}" class="w-full h-full object-cover" />
            <div id="loading-${e}" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
            </div>
          `,r&&r(b)}catch(n){console.error("Erro no upload:",n.message),E.show("Erro ao carregar imagem: "+n.message,"error")}finally{a.classList.add("hidden"),a.classList.remove("flex"),setTimeout(()=>{d.classList.add("hidden"),u.style.width="0%"},1e3)}}})}},X={async render(){var e;try{window.currentAdminTab=window.currentAdminTab||"overview";const{data:{session:r}}=await w.auth.getSession();let s=w.from("tenant_settings").select("*");(e=r==null?void 0:r.user)!=null&&e.id&&(s=s.eq("owner_id",r.user.id));const{data:a}=await s.maybeSingle(),t=a||{},i=t.option1_label||"Cores",d=t.option2_label||"Tamanhos",u=t.store_name&&t.logo_url&&t.whatsapp_number;let y=w.from("orders").select("*").order("created_at",{ascending:!1}),f=w.from("products").select("*, categories(name)").order("created_at",{ascending:!1}),n=w.from("categories").select("*").order("name",{ascending:!0});t.id&&(y=y.or(`tenant_id.eq.${t.id},tenant_id.is.null`),f=f.or(`tenant_id.eq.${t.id},tenant_id.is.null`),n=n.or(`tenant_id.eq.${t.id},tenant_id.is.null`));const[g,m,c]=await Promise.all([y,f,n]),b=m.data||[],$=c.data||[],j=g.data||[],l=j.filter(p=>p.status!=="cancelled"),o=l.reduce((p,q)=>p+Number(q.total_amount),0),x=j.length,h=l.length>0?o/l.length:0,v=b.filter(p=>p.is_active!==!1).length,k=p=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(p),L=(p,q=null)=>p.map(S=>{const P=S.id===q,_=S.promo_price||S.price,T=S.promo_price?S.price:null,B=T&&Number(T)>Number(_);return`
            <div class="border border-gray-100 dark:border-gray-800/80 rounded-2xl bg-white dark:bg-gray-900 mb-3 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
              <div onclick="window.toggleAdminProduct('${S.id}')" class="p-3 flex items-center justify-between bg-gray-55/50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-12 h-12 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0">
                    <img src="${S.image_url||""}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-black text-gray-800 dark:text-gray-100 truncate uppercase tracking-tight">${S.title}</h4>
                    <p class="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      ${B?`<span class="line-through mr-1.5 opacity-50">R$ ${T}</span>`:""}
                      <span class="${B?"text-red-650 dark:text-red-400 font-extrabold":"text-lojaPrimaria font-extrabold"}">R$ ${_}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-2">
                  <span class="text-gray-400 p-1.5 transition-transform duration-300 ${P?"rotate-180 text-lojaPrimaria":""}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>

              <div class="${P?"block":"hidden"} p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                <div class="space-y-4">
                    <div>
                        <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Descrição</h5>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">${S.description||"Sem descrição cadastrada."}</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      ${S.colors&&S.colors.length>0?`
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Cores Disponíveis</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${S.colors.map(I=>`<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${I}</span>`).join("")}
                              </div>
                          </div>
                      `:""}
                      ${S.attributes&&S.attributes.length>0?`
                          <div>
                              <h5 class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tamanhos / Variações</h5>
                              <div class="flex flex-wrap gap-1">
                                  ${S.attributes.map(I=>`<span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">${I}</span>`).join("")}
                              </div>
                          </div>
                      `:""}
                    </div>
                </div>
                
                <div class="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onclick="event.stopPropagation(); window.cloneAdminProduct('${S.id}')" class="bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                    Clonar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.editAdminProduct('${S.id}')" class="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-650 dark:text-blue-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Editar
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.deleteAdminProduct('${S.id}')" class="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-650 dark:text-red-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          `}).join(""),C=p=>window.currentAdminTab===p?"bg-lojaPrimaria text-white shadow-lg shadow-lojaPrimaria/20 scale-[1.02]":"bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800/80";return`
        <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8 transition-colors duration-300">
          <div class="max-w-7xl mx-auto space-y-6">

            <!-- CABEÇALHO ADMIN PREMIUM -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800/80">
              <div class="flex items-center gap-4">
                ${t.logo_url?`<div class="w-12 h-12 rounded-2xl overflow-hidden border bg-white dark:bg-gray-800 flex items-center justify-center p-1"><img src="${t.logo_url}" class="max-h-full max-w-full object-contain" /></div>`:`<div class="w-12 h-12 rounded-2xl bg-lojaPrimaria/10 text-lojaPrimaria flex items-center justify-center font-black uppercase text-lg">${(t.store_name||"V").charAt(0)}</div>`}
                <div>
                  <div class="flex items-center gap-2.5">
                    <h1 class="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Painel Administrativo</h1>
                    ${u?'<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Configurado</span>':'<span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">Pendente</span>'}
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
              </div>
            </div>

            <!-- NAVEGAÇÃO POR ABAS (TABS) -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button onclick="window.toggleAdminTab('overview')" class="${C("overview")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📊 Visão Geral
              </button>
              <button onclick="window.toggleAdminTab('catalog')" class="${C("catalog")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                🛍️ Catálogo
              </button>
              <button onclick="window.toggleAdminTab('categories')" class="${C("categories")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📁 Categorias
              </button>
              <button onclick="window.toggleAdminTab('orders')" class="${C("orders")} font-black px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
                📝 Pedidos (${j.filter(p=>p.status==="pending").length})
              </button>
              <button onclick="window.toggleAdminTab('settings')" class="${C("settings")} font-black col-span-2 md:col-span-1 px-4 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2">
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
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${k(o)}</h3>
                    <p class="text-[9px] text-green-500 font-extrabold uppercase mt-1">▲ Pedidos ativos</p>
                  </div>
                </div>
                <!-- Card 2 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pedidos Totais</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${x}</h3>
                    <p class="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">Histórico completo</p>
                  </div>
                </div>
                <!-- Card 3 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ticket Médio</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${k(h)}</h3>
                    <p class="text-[9px] text-lojaPrimaria font-extrabold uppercase mt-1">Média por venda</p>
                  </div>
                </div>
                <!-- Card 4 -->
                <div class="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produtos Ativos</span>
                  <div class="mt-2">
                    <h3 class="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight">${v}</h3>
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
                      ${j.filter(p=>p.status==="pending"||p.status==="new").map(p=>`
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
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${k(p.total_amount)}</span></span>
                            <span>${p.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${p.id}', 'preparing')" class="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🍳 Preparar Pedido
                          </button>
                        </div>
                      `).join("")}
                      ${j.filter(p=>p.status==="pending"||p.status==="new").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido novo</p>':""}
                    </div>
                  </div>

                  <!-- COLUNA: EM PREPARO -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      🍳 Em Preparação
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${j.filter(p=>p.status==="preparing").map(p=>`
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
                            <span>Total: <span class="text-lojaPrimaria font-black text-xs">${k(p.total_amount)}</span></span>
                            <span>${p.payment_method}</span>
                          </div>
                          <button onclick="window.advanceOrderStatus('${p.id}', 'shipped')" class="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                            🚚 Enviar para Entrega
                          </button>
                        </div>
                      `).join("")}
                      ${j.filter(p=>p.status==="preparing").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido em preparo</p>':""}
                    </div>
                  </div>

                  <!-- COLUNA: ENTREGUES / ENVIADOS -->
                  <div class="space-y-3 bg-gray-50/30 dark:bg-gray-950/40 p-4 rounded-[1.5rem] border border-gray-150 dark:border-gray-800/50">
                    <h4 class="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      🚚 Saiu / Entregue
                    </h4>
                    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      ${j.filter(p=>p.status==="shipped"||p.status==="delivered").map(p=>`
                        <div class="bg-white dark:bg-gray-905 p-4 rounded-2xl border border-gray-150 dark:border-gray-850 space-y-2 shadow-sm opacity-80 hover:opacity-100 transition">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="text-xs font-black text-gray-900 dark:text-white">${p.customer_name}</p>
                              <span class="text-[9px] text-gray-450 font-medium">${new Date(p.created_at).toLocaleDateString()}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[8px] font-black uppercase ${p.status==="delivered"?"bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400":"bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400"}">${p.status==="delivered"?"Entregue":"Saiu para Entrega"}</span>
                          </div>
                          <div class="text-[10px] text-gray-600 dark:text-gray-400 font-bold flex justify-between pt-1">
                            <span>Total: <span class="text-green-600 font-black">${k(p.total_amount)}</span></span>
                            ${p.status==="shipped"?`
                              <button onclick="window.advanceOrderStatus('${p.id}', 'delivered')" class="text-[9px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-lg">✓ Concluir</button>
                            `:""}
                          </div>
                        </div>
                      `).join("")}
                      ${j.filter(p=>p.status==="shipped"||p.status==="delivered").length===0?'<p class="text-center text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest py-8">Nenhum pedido finalizado</p>':""}
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
                            ${$.map(p=>`<option value="${p.id}">${p.name}</option>`).join("")}
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
                      ${D.render("prod","","Foto Principal do Produto")}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${i}</label>
                         <input type="text" id="prod-colors" class="w-full bg-gray-50 dark:bg-gray-955 border-none rounded-xl p-3.5 text-xs font-bold text-gray-900 dark:text-gray-100" placeholder="Separe por vírgula" />
                         <div id="colors-preview" class="flex flex-wrap gap-1 mt-1.5 min-h-[16px]"></div>
                      </div>
                      <div>
                         <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5">${d}</label>
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
                    <h3 class="font-black text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Produtos no Catálogo (${b.length})</h3>
                  </div>
                  <div class="grid grid-cols-1 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin" id="admin-product-list">
                    ${L(b,window.currentExpandedId)}
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
                  ${$.map(p=>`
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
                  ${$.length===0?'<p class="text-center text-gray-400 py-6 text-xs uppercase tracking-widest font-bold">Nenhuma categoria cadastrada</p>':""}
               </div>
            </div>

            <!-- ABA 4: HISTÓRICO DE PEDIDOS -->
            <div class="${window.currentAdminTab==="orders"?"block":"hidden"} space-y-6 animate-in fade-in duration-300">
               <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h2 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                     Central Histórica de Pedidos
                  </h2>

                  <div class="space-y-8">
                     ${(()=>{const p={};return j.forEach(q=>{const S=new Date(q.created_at),P=new Date,_=new Date(P);_.setDate(_.getDate()-1);let T=S.toLocaleDateString("pt-BR");S.toDateString()===P.toDateString()?T="Hoje":S.toDateString()===_.toDateString()&&(T="Ontem"),p[T]||(p[T]=[]),p[T].push(q)}),Object.entries(p).map(([q,S])=>`
                           <div class="space-y-4">
                              <div class="flex items-center gap-4">
                                 <span class="text-[9px] font-black text-gray-450 dark:text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">Pedidos de ${q}</span>
                                 <div class="h-px bg-gray-100 dark:bg-gray-800/80 w-full"></div>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 ${S.map(P=>{let _="bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20";return P.status==="preparing"&&(_="bg-amber-50 text-amber-600 dark:bg-amber-950/20"),P.status==="shipped"&&(_="bg-purple-50 text-purple-600 dark:bg-purple-950/20"),P.status==="delivered"&&(_="bg-green-50 text-green-600 dark:bg-green-950/20"),P.status==="cancelled"&&(_="bg-red-50 text-red-650 dark:bg-red-950/20"),`
                                    <div class="bg-gray-55/50 dark:bg-gray-900/50 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 space-y-4 hover:border-lojaPrimaria/30 transition group shadow-sm">
                                       <div class="flex justify-between items-start">
                                          <div>
                                             <p class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">#${P.id.slice(0,8)} • ${new Date(P.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                                             <h4 class="text-xs font-black text-gray-950 dark:text-white uppercase tracking-tight">${P.customer_name}</h4>
                                          </div>
                                          <span class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${_}">${P.status}</span>
                                       </div>

                                       <div class="space-y-2">
                                          <div class="text-[10px] text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-850/80 leading-relaxed italic">
                                             ${P.items_summary||"Itens não especificados"}
                                          </div>
                                       </div>

                                       <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Entrega</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase truncate">${P.delivery_address?"Delivery":"Retirada"}</p>
                                          </div>
                                          <div>
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Pagamento</p>
                                             <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">${P.payment_method}</p>
                                          </div>
                                          <div class="col-span-2 text-right pt-2 border-t border-gray-100 dark:border-gray-800/50">
                                             <p class="text-[8px] font-black text-gray-400 uppercase mb-0.5">Total</p>
                                             <p class="text-sm font-black text-lojaPrimaria">${k(P.total_amount)}</p>
                                          </div>
                                       </div>

                                       <div class="flex gap-2">
                                          <button onclick="window.advanceOrderStatus('${P.id}', '${P.status==="pending"?"preparing":P.status==="preparing"?"shipped":"delivered"}')" class="flex-1 bg-white dark:bg-gray-800 border border-gray-205 dark:border-gray-700 hover:border-lojaPrimaria text-gray-900 dark:text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition shadow-sm">
                                             Status
                                          </button>
                                          <button onclick="window.advanceOrderStatus('${P.id}', 'cancelled')" class="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition">
                                             ✕ Cancelar
                                          </button>
                                       </div>
                                    </div>
                                    `}).join("")}
                              </div>
                           </div>
                        `).join("")})()}
                     ${j.length===0?'<p class="text-center text-gray-400 dark:text-gray-500 py-12 text-xs uppercase tracking-widest font-black">Nenhum pedido registrado no sistema</p>':""}
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
                          ${D.render("logo",t.logo_url,"Logotipo da Loja")}
                          ${t.logo_url?`<button type="button" onclick="window.removeTenantMedia('logo')" class="text-[9px] font-black uppercase text-red-650 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-100/50 transition">✕ Remover Imagem</button>`:""}
                        </div>
                        <div class="space-y-2 bg-gray-50/30 dark:bg-gray-955/40 p-4 rounded-2xl border dark:border-gray-850">
                          ${D.render("hero",t.hero_image_url,"Banner Hero da Vitrine")}
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
      `}catch(r){return console.error(r),'<div class="p-20 text-center font-black uppercase text-red-500">Erro de Conexão com o Supabase. Verifique sua chave API.</div>'}},bindEvents(e,r){const s=e.querySelector("#admin-tenant-form"),a=e.querySelector("#admin-product-form"),t=e.querySelector("#prod-category"),i=e.querySelector("#new-category-name"),d=e.querySelector("#admin-direct-category-form"),u=e.querySelector("#prod-colors"),y=e.querySelector("#colors-preview"),f=e.querySelector("#prod-attributes"),n=e.querySelector("#attrs-preview"),g=(l,o)=>{if(!l||!o)return;const x=l.value.split(",").map(h=>h.trim()).filter(h=>h);o.innerHTML=x.map(h=>`
        <span class="inline-flex items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase border border-gray-200 dark:border-gray-700">
          ${h}
        </span>
      `).join("")};if(u&&y&&(u.oninput=()=>g(u,y),g(u,y)),f&&n&&(f.oninput=()=>g(f,n),g(f,n)),D.bindEvents("logo",l=>{l||(e.querySelector("#url-logo").value="")}),D.bindEvents("hero",l=>{l||(e.querySelector("#url-hero").value="")}),D.bindEvents("prod",l=>{l||(e.querySelector("#url-prod").value="")}),window.removeTenantMedia=async l=>{const o=l==="logo"?"logo_url":"hero_image_url",{data:x}=await w.from("tenant_settings").select("id").maybeSingle();if(x){const{error:h}=await w.from("tenant_settings").update({[o]:null}).eq("id",x.id);h?E.show("Erro ao remover: "+h.message,"error"):(E.show("Imagem removida com sucesso!"),r())}},window.toggleAdminTab=l=>{window.currentAdminTab=l,r()},window.toggleStoreTheme=()=>{const l=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",l?"dark":"light");const o=e.querySelector("#theme-icon");o&&(o.innerText=l?"☀️":"🌙")},localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark");const l=e.querySelector("#theme-icon");l&&(l.innerText="☀️")}t&&(t.onchange=()=>{t.value==="new"?(i.classList.remove("hidden"),i.required=!0,i.focus()):(i.classList.add("hidden"),i.required=!1)}),d&&(d.onsubmit=async l=>{l.preventDefault();const o=e.querySelector("#direct-cat-name"),x=o.value.trim();if(x)try{const h=x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-"),{data:v}=await w.from("tenant_settings").select("id").maybeSingle(),{error:k}=await w.from("categories").insert({name:x,slug:h,tenant_id:(v==null?void 0:v.id)||null});if(k)throw k;E.show("Categoria criada com sucesso!"),o.value="",r()}catch(h){E.show("Erro ao criar categoria: "+h.message,"error")}}),s&&(s.onsubmit=async l=>{l.preventDefault();const o=e.querySelector("#btn-save-tenant"),x=e.querySelector("#btn-save-text"),h=e.querySelector("#btn-save-loader");o.disabled=!0,x.classList.add("hidden"),h.classList.remove("hidden");try{const v={store_name:e.querySelector("#conf-name").value,logo_url:e.querySelector("#url-logo").value,hero_image_url:e.querySelector("#url-hero").value,hero_title:e.querySelector("#conf-hero-title").value,hero_subtitle:e.querySelector("#conf-hero-subtitle").value,whatsapp_number:e.querySelector("#conf-phone").value,delivery_fee:parseFloat(e.querySelector("#conf-delivery-fee").value||0),address:e.querySelector("#conf-address").value,primary_color:e.querySelector("#conf-primary").value,secondary_color:e.querySelector("#conf-secondary").value,instagram_url:e.querySelector("#conf-instagram").value,facebook_url:e.querySelector("#conf-facebook").value,footer_bio:e.querySelector("#conf-footer-bio").value||(e.querySelector("#conf-show-hero-text").checked?"SHOW_HERO_TEXT":"HIDE_HERO_TEXT")};v.footer_bio||(v.footer_bio=e.querySelector("#conf-show-hero-text").checked?"SHOW_HERO_TEXT":"HIDE_HERO_TEXT");const{data:k}=await w.from("tenant_settings").select("id").maybeSingle();let L;if(k?L=(await w.from("tenant_settings").update(v).eq("id",k.id)).error:L=(await w.from("tenant_settings").insert(v)).error,!L)N(v.primary_color,v.secondary_color),E.show("Configurações da loja salvas com sucesso!"),r();else throw L}catch(v){E.show("Erro ao salvar: "+v.message,"error"),o.disabled=!1,x.classList.remove("hidden"),h.classList.add("hidden")}});const m=e.querySelector("#delete-modal"),c=e.querySelector("#delete-item-name"),b=e.querySelector("#btn-cancel-delete"),$=e.querySelector("#btn-confirm-delete");let j=null;window.toggleAdminProduct=l=>{window.currentExpandedId=window.currentExpandedId===l?null:l,r()},window.deleteAdminProduct=async l=>{const{data:o}=await w.from("products").select("title").eq("id",l).single();j=l,c.innerText=(o==null?void 0:o.title)||"este produto",m.classList.remove("hidden")},window.deleteCategory=async l=>{if(confirm("Atenção: Excluir esta categoria poderá desvincular produtos. Deseja prosseguir com a exclusão?")){const{error:o}=await w.from("categories").delete().eq("id",l);o?E.show("Erro ao excluir: "+o.message,"error"):(E.show("Categoria removida com sucesso!"),r())}},b.onclick=()=>m.classList.add("hidden"),$.onclick=async()=>{const{error:l}=await w.from("products").delete().eq("id",j);l?E.show("Erro ao deletar produto: "+l.message,"error"):E.show("Produto excluído do catálogo!"),m.classList.add("hidden"),r()},window.cloneAdminProduct=async l=>{const{data:o}=await w.from("products").select("*").eq("id",l).single();o&&(window.currentAdminTab="catalog",r(),setTimeout(()=>{const x=e.querySelector("#product-form-title"),h=e.querySelector("#btn-prod-submit");x&&(x.innerText="Clonando: "+o.title),h&&(h.innerText="Adicionar como Novo"),e.querySelector("#product-id").value="",e.querySelector("#prod-title").value=o.title+" (Cópia)",e.querySelector("#prod-category").value=o.category_id||"",e.querySelector("#prod-description").value=o.description||"",e.querySelector("#prod-price").value=o.price,e.querySelector("#prod-promo").value=o.promo_price||"";const v=e.querySelector("#prod-colors"),k=e.querySelector("#prod-attributes");v.value=Array.isArray(o.colors)?o.colors.join(", "):"",k.value=Array.isArray(o.attributes)?o.attributes.join(", "):"",v.dispatchEvent(new Event("input")),k.dispatchEvent(new Event("input"));const L=Array.isArray(o.image_urls)?o.image_urls.filter(S=>S!==o.image_url):[];e.querySelector("#prod-image-urls").value=L.join(", ");const C=e.querySelector("#url-prod");C.value=o.image_url||"";const p=e.querySelector("#container-prod").querySelector(".relative"),q=document.getElementById("remove-prod");o.image_url&&(q&&(q.classList.remove("hidden"),q.classList.add("flex")),p.innerHTML=`
                  <img src="${o.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                  </div>
              `),window.scrollTo({top:0,behavior:"smooth"})},100))},window.advanceOrderStatus=async(l,o)=>{const{error:x}=await w.from("orders").update({status:o}).eq("id",l);x?E.show("Erro ao atualizar status do pedido: "+x.message,"error"):(E.show("Status do pedido atualizado!"),r())},window.editAdminProduct=async l=>{const{data:o}=await w.from("products").select("*").eq("id",l).single();o&&(window.currentAdminTab="catalog",r(),setTimeout(()=>{const x=e.querySelector("#product-form-title"),h=e.querySelector("#btn-prod-submit");x&&(x.innerText="Editando: "+o.title),h&&(h.innerText="Salvar Alterações"),e.querySelector("#product-id").value=o.id,e.querySelector("#prod-title").value=o.title,e.querySelector("#prod-category").value=o.category_id||"",e.querySelector("#prod-description").value=o.description||"",e.querySelector("#prod-price").value=o.price,e.querySelector("#prod-promo").value=o.promo_price||"";const v=e.querySelector("#prod-colors"),k=e.querySelector("#prod-attributes");v.value=Array.isArray(o.colors)?o.colors.join(", "):"",k.value=Array.isArray(o.attributes)?o.attributes.join(", "):"",v.dispatchEvent(new Event("input")),k.dispatchEvent(new Event("input"));const L=Array.isArray(o.image_urls)?o.image_urls.filter(S=>S!==o.image_url):[];e.querySelector("#prod-image-urls").value=L.join(", ");const C=e.querySelector("#url-prod");C.value=o.image_url||"";const p=e.querySelector("#container-prod").querySelector(".relative"),q=document.getElementById("remove-prod");o.image_url&&(q&&(q.classList.remove("hidden"),q.classList.add("flex")),p.innerHTML=`
                  <img src="${o.image_url}" id="preview-prod" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';" />
                  <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
                  </div>
              `),window.scrollTo({top:0,behavior:"smooth"})},100))},a&&(a.onsubmit=async l=>{l.preventDefault();try{let o=t.value;const x=e.querySelector("#product-id").value,{data:h}=await w.from("tenant_settings").select("id").maybeSingle();if(o==="new"){const _=i.value,T=_.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-"),{data:B,error:I}=await w.from("categories").insert({name:_,slug:T,tenant_id:(h==null?void 0:h.id)||null}).select().single();if(I)throw I;o=B.id}const v=e.querySelector("#prod-price").value,k=e.querySelector("#prod-promo").value,L=e.querySelector("#prod-image-urls").value.split(",").map(_=>_.trim()).filter(_=>_),C=e.querySelector("#url-prod").value,p={title:e.querySelector("#prod-title").value,category_id:o||null,description:e.querySelector("#prod-description").value,price:parseFloat(v),promo_price:k?parseFloat(k):null,image_url:C,image_urls:[C,...L].filter(_=>_),colors:e.querySelector("#prod-colors").value.split(",").map(_=>_.trim()).filter(_=>_),attributes:e.querySelector("#prod-attributes").value.split(",").map(_=>_.trim()).filter(_=>_),tenant_id:(h==null?void 0:h.id)||null};let q;if(x?q=(await w.from("products").update(p).eq("id",x)).error:q=(await w.from("products").insert(p)).error,q)throw q;E.show("Produto salvo no catálogo com sucesso!"),a.reset(),e.querySelector("#prod-image-urls").value="",e.querySelector("#product-id").value="",e.querySelector("#product-form-title").innerText="Cadastrar Novo Produto",e.querySelector("#btn-prod-submit").innerText="Adicionar ao Catálogo";const S=e.querySelector("#container-prod").querySelector(".relative"),P=document.getElementById("remove-prod");P&&(P.classList.remove("flex"),P.classList.add("hidden")),S.innerHTML=`
              <div id="placeholder-prod" class="text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
              </div>
              <div id="loading-prod" class="absolute inset-0 bg-white/80 items-center justify-center hidden">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-lojaPrimaria border-t-transparent"></div>
              </div>
          `,r()}catch(o){E.show("Erro ao salvar produto: "+o.message,"error")}})}},J={async render(){try{window.superAdminTab=window.superAdminTab||"tenants";const{data:e,error:r}=await w.from("tenant_settings").select("*").order("created_at",{ascending:!1});if(r)throw r;const s=e||[],a=t=>t?new Date(t).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}):"—";return`
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
                  ${s.length} lojas ativas
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
              ${[{id:"tenants",label:"🏪 Gerenciar Lojas"},{id:"create",label:"+ Nova Loja"}].map(t=>`
                <button onclick="window.superAdminTab='${t.id}'; window.refreshSuperAdmin()" 
                  class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition border ${window.superAdminTab===t.id?"bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/30":"bg-white/5 text-gray-500 border-white/10 hover:border-white/20 hover:text-gray-300"}">
                  ${t.label}
                </button>
              `).join("")}
            </nav>

            <!-- Tenants List Tab -->
            <div class="${window.superAdminTab==="tenants"?"block":"hidden"} space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xs font-black text-gray-500 uppercase tracking-widest">Todos os Lojistas (${s.length})</h2>
              </div>

              ${s.length===0?`
                <div class="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
                  <div class="text-6xl">🏪</div>
                  <p class="text-gray-500 font-bold">Nenhuma loja cadastrada.</p>
                  <button onclick="window.superAdminTab='create'; window.refreshSuperAdmin()" class="bg-violet-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-violet-500 transition">
                    Criar primeira loja
                  </button>
                </div>
              `:s.map(t=>`
                <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-violet-500/30 hover:bg-white/[0.05] transition group">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    ${t.logo_url?`<img src="${t.logo_url}" class="w-14 h-14 rounded-2xl object-cover border border-white/10 flex-shrink-0" onerror="this.style.display='none'" />`:`<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0" style="background:${t.primary_color||"#6d28d9"}33; color:${t.primary_color||"#a78bfa"}">${(t.store_name||"?").charAt(0)}</div>`}
                    <div class="min-w-0">
                      <h3 class="font-black text-white text-sm uppercase tracking-tight truncate">${t.store_name||"(sem nome)"}</h3>
                      <p class="text-[10px] text-gray-600 font-bold mt-0.5">slug: <span class="text-violet-400">/${t.slug||t.id}</span></p>
                      <p class="text-[10px] text-gray-700 font-bold">WhatsApp: ${t.whatsapp_number||"—"} · Criado em ${a(t.created_at)}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <a href="/?store=${t.slug||t.id}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-violet-400 transition px-3 py-2 rounded-xl border border-white/10 hover:border-violet-500/30">
                      Ver Vitrine ↗
                    </a>
                    <button onclick="window.superAdminEditTenant('${t.id}')" class="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition px-3 py-2 rounded-xl border border-blue-500/20 hover:border-blue-500/40">
                      Editar
                    </button>
                    <button onclick="window.superAdminDeleteTenant('${t.id}', '${t.store_name||t.id}')" class="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition px-3 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40">
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
      </div>`}},bindEvents(e,r){var g;window.refreshSuperAdmin=r,(g=e.querySelector("#super-logout-btn"))==null||g.addEventListener("click",async()=>{await w.auth.signOut(),window.location.search=""});const s=e.querySelector("#t-slug"),a=e.querySelector("#slug-preview");s&&a&&(s.oninput=()=>{const m=s.value.toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/--+/g,"-");s.value=m,a.textContent=m||"..."});const t=e.querySelector("#t-store-name");t&&s&&(t.oninput=()=>{if(!e.querySelector("#edit-tenant-id").value){const m=t.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");s.value=m,a&&(a.textContent=m||"...")}});const i=(m,c)=>{const b=e.querySelector(`#${m}`),$=e.querySelector(`#${c}`);!b||!$||(b.oninput=()=>{$.value=b.value},$.oninput=()=>{/^#[0-9A-Fa-f]{6}$/.test($.value)&&(b.value=$.value)})};i("t-primary-color","t-primary-color-hex"),i("t-secondary-color","t-secondary-color-hex");const d=e.querySelector("#t-niche"),u=e.querySelector("#t-option1-label"),y=e.querySelector("#t-option2-label"),f={fashion:{o1:"Tamanho",o2:"Cor"},food:{o1:"Adicionais",o2:"Bebida"},beauty:{o1:"Variação",o2:"Cor"},electronics:{o1:"Capacidade",o2:"Cor"},pets:{o1:"Tamanho",o2:"Cor"},home:{o1:"Dimensão",o2:"Cor"},sports:{o1:"Tamanho",o2:"Cor"}};d&&(d.onchange=()=>{const m=f[d.value];m&&(u&&(u.value=m.o1),y&&(y.value=m.o2))}),window.superAdminEditTenant=async m=>{const{data:c}=await w.from("tenant_settings").select("*").eq("id",m).single();c&&(window.superAdminTab="create",r(),setTimeout(()=>{const b=(j,l)=>{const o=e.querySelector(j);o&&(o.value=l||"")};b("#edit-tenant-id",c.id),b("#t-store-name",c.store_name),b("#t-slug",c.slug),b("#t-whatsapp",c.whatsapp_number),b("#t-hero-title",c.hero_title),b("#t-hero-subtitle",c.hero_subtitle),b("#t-primary-color",c.primary_color||"#6d28d9"),b("#t-primary-color-hex",c.primary_color||"#6d28d9"),b("#t-secondary-color",c.secondary_color||"#4c1d95"),b("#t-secondary-color-hex",c.secondary_color||"#4c1d95"),b("#t-option1-label",c.option1_label),b("#t-option2-label",c.option2_label),b("#t-niche",c.niche),a&&(a.textContent=c.slug||"...");const $=e.querySelector("#btn-super-save-tenant");$&&($.innerText="Salvar Alterações")},100))},window.superAdminDeleteTenant=async(m,c)=>{if(!confirm(`Tem certeza que deseja excluir a loja "${c}"? Esta ação é irreversível.`))return;const{error:b}=await w.from("tenant_settings").delete().eq("id",m);b?E.show("Erro ao excluir: "+b.message,"error"):(E.show(`Loja "${c}" excluída com sucesso!`),r())};const n=e.querySelector("#super-create-tenant-form");n&&(n.onsubmit=async m=>{var l,o,x,h,v,k,L,C,p,q,S,P,_,T,B,I,z,H,F,V;m.preventDefault();const c=(l=e.querySelector("#edit-tenant-id"))==null?void 0:l.value,b={store_name:(x=(o=e.querySelector("#t-store-name"))==null?void 0:o.value)==null?void 0:x.trim(),slug:(v=(h=e.querySelector("#t-slug"))==null?void 0:h.value)==null?void 0:v.trim(),whatsapp_number:(L=(k=e.querySelector("#t-whatsapp"))==null?void 0:k.value)==null?void 0:L.trim(),hero_title:((p=(C=e.querySelector("#t-hero-title"))==null?void 0:C.value)==null?void 0:p.trim())||null,hero_subtitle:((S=(q=e.querySelector("#t-hero-subtitle"))==null?void 0:q.value)==null?void 0:S.trim())||null,primary_color:((P=e.querySelector("#t-primary-color-hex"))==null?void 0:P.value)||"#6d28d9",secondary_color:((_=e.querySelector("#t-secondary-color-hex"))==null?void 0:_.value)||"#4c1d95",option1_label:((B=(T=e.querySelector("#t-option1-label"))==null?void 0:T.value)==null?void 0:B.trim())||null,option2_label:((z=(I=e.querySelector("#t-option2-label"))==null?void 0:I.value)==null?void 0:z.trim())||null,niche:((H=e.querySelector("#t-niche"))==null?void 0:H.value)||null},$=(V=(F=e.querySelector("#t-owner-email"))==null?void 0:F.value)==null?void 0:V.trim();if($){const{data:ie}=await w.from("tenant_settings").select("owner_id").eq("owner_id",$).limit(1);b.owner_email=$}let j;c?{error:j}=await w.from("tenant_settings").update(b).eq("id",c):{error:j}=await w.from("tenant_settings").insert(b),j?E.show("Erro: "+j.message,"error"):(E.show(c?"Loja atualizada com sucesso!":"Nova loja criada com sucesso!"),window.superAdminTab="tenants",r())})}},K={render(){return`
      <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
          <div class="text-center">
            <h2 class="text-3xl font-black text-gray-900 tracking-tight">Área Restrita</h2>
            <p class="text-sm text-gray-500 mt-1">Identifique-se para acessar o painel administrativo.</p>
          </div>
          
          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">E-mail</label>
              <input type="email" id="login-email" required class="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-lojaPrimaria focus:outline-none" placeholder="admin@sualoja.com" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Senha</label>
              <input type="password" id="login-password" required class="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-lojaPrimaria focus:outline-none" placeholder="••••••••" />
            </div>
            
            <button type="submit" class="w-full bg-lojaPrimaria hover:bg-opacity-90 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm mt-2">
              Entrar no Painel
            </button>
          </form>
          
          <div class="text-center pt-2">
            <a href="/" class="text-xs text-gray-400 hover:text-gray-600 transition font-medium">← Voltar para a Vitrine</a>
          </div>
        </div>
      </div>
    `},bindEvents(e){const r=e.querySelector("#login-form");r&&(r.onsubmit=async s=>{s.preventDefault();const a=e.querySelector("#login-email").value,t=e.querySelector("#login-password").value,{data:i,error:d}=await w.auth.signInWithPassword({email:a,password:t});d?E.show("Acesso Negado: Dados inválidos ou sem permissão.","error"):window.location.search="?page=admin"})}},ae="admin@catalogopro.com";async function oe(){var a;(localStorage.getItem("theme")==="dark"||!localStorage.getItem("theme")&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.classList.add("dark");const e=document.getElementById("app");if(!e)return;const s=new URLSearchParams(window.location.search).get("page");if(s==="login"){e.innerHTML=K.render(),K.bindEvents(e);return}if(s==="admin"){let t=null;try{}catch(d){console.warn("Supabase Auth indisponível:",d.message)}if(!t){window.location.search="?page=login";return}if(((a=t.user)==null?void 0:a.email)===ae){async function d(){e.innerHTML=await J.render(),J.bindEvents(e,()=>d())}await d()}else{await A.initTenant();async function d(){e.innerHTML=await X.render(),X.bindEvents(e,()=>d())}await d()}return}if(s==="portal"){e.innerHTML=await Q.render(),Q.bindEvents(e);return}await A.initTenant(),await se(e)}async function se(e){const r=A.getState().tenant||{store_name:"Catálogo Pro",logo_url:null},s=r!=null&&r.logo_url?`<img src="${r.logo_url}" class="h-9 w-auto object-contain" alt="${r.store_name||"Logo"}" />`:`
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-xl bg-lojaPrimaria text-white flex items-center justify-center font-black text-sm shadow-md shadow-lojaPrimaria/30">CP</span>
        <span class="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">${(r==null?void 0:r.store_name)||"Catálogo Pro"}</span>
      </div>
    `;e.innerHTML=`
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <a href="/" class="hover:opacity-90 transition">${s}</a>
          <span class="hidden md:inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Vitrine Online
          </span>
        </div>
        
        <div class="flex items-center gap-3">
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
  `;const a=document.getElementById("theme-toggle-btn");a&&(a.onclick=()=>{const n=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",n?"dark":"light")});const t=document.getElementById("home-view-container"),i=document.getElementById("cart-drawer-container"),d=document.getElementById("checkout-modal-container"),u=document.getElementById("cart-counter-slot");async function y(){const{cart:n}=A.getState(),g=parseInt((u==null?void 0:u.innerText)||"0"),m=n.reduce((c,b)=>c+b.quantity,0);if(u&&(u.innerText=m,m>g)){const c=document.getElementById("floating-cart-trigger");c==null||c.classList.add("scale-110"),setTimeout(()=>c==null?void 0:c.classList.remove("scale-110"),300)}i.innerHTML=M.render(),M.bindEvents(i,()=>O.open()),d.innerHTML=O.render(),O.bindEvents(d,async c=>{const{tenant:b}=A.getState();(await re.createOrder({...c,cartItems:n,tenant:b})).success&&(O.close(),A.clearCart())})}t.innerHTML=await W.render(),W.bindEvents(t),window.addEventListener("global:add-to-cart",async n=>{const{id:g,quantity:m,size:c,color:b,option1:$,option2:j}=n.detail,l=await Y.getById(g);l&&(A.addToCart(l,m||1,{size:c,color:b,option1:$,option2:j}),M.open())});const f=document.getElementById("floating-cart-trigger");f&&(f.onclick=()=>M.open()),A.subscribe(()=>y()),await y()}oe();
