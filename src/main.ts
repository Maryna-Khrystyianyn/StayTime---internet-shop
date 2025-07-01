//=====================================================================
//=========wenn element visibl=========================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
        console.log("fffffff");
      }
    });
  },
  { threshold: 0.1 }
);
console.log("hallo");
const h2Category = document.querySelector(
  ".category-header"
) as HTMLHeadElement;

if (h2Category) {
  observer.observe(h2Category);
}
//======================================================================
//===== BURGER MENUE ===================================================
const burger = document.getElementById("burger") as HTMLElement;
const burgerNav = document.querySelector(
  ".container-burger-nav"
) as HTMLDivElement;

burger.addEventListener("mouseover", () => {
  burgerNav.style.display = "block";
});
burgerNav.addEventListener("mouseleave", () => {
  burgerNav.style.display = "none";
});

//======================================================================
//====== INTERFACES ====================================================
interface Card {
  id: number;
  name: string;
  price: number;
  description: string[];
  image: string;
  type: string;
  discont: number;
}

interface CartItem {
  id: number;
  name: string;
  type: string;
  img: string;
  price: number;
  quantity: number;
  total: number;
}

declare const Stripe: any;
const cards: Card[] = [];
let cart: CartItem[] = getCart();

const cartModal = document.querySelector(".cart-modal") as HTMLDivElement;

//======================================================================
//==========SALE========================================================

const mainDiskont = 10;

//======================================================================
//=====LocalStorag======================================================
function setCart(myCart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(myCart));
}
function getCart() {
  const storagCart = localStorage.getItem("cart");
  if (storagCart) {
    return JSON.parse(storagCart);
  } else return [];
}

function cleanCart() {
  localStorage.removeItem("cart");
}

//======================================================================
//=====functions for add/remov/change/delete item to cart ==============
const isInCart = (x: number) => {
  let result = -1;
  cart.forEach((item, index) => {
    console.log(`item.id = ${item.id}, index = ${index}`);
    if (item.id == x) {
      result = index;
    }
  });
  return result;
};
const cauntTotal = () => {
  let total: number = 0;
  cart.forEach((item) => {
    total += item.total;
  });
  return Math.floor(total * 100) / 100;
};
const printCartTotal = (total: number) => {
  const totalPrice = document.getElementById("total-price") as HTMLSpanElement;
  if (total) {
    totalPrice.textContent = `${total} $`;
  }else{totalPrice.textContent = `0.00 $`;}
};

function addToCart(item: Card) {
  let indexInCart = isInCart(item.id);
  if (indexInCart === -1) {
    let discont = mainDiskont < item.discont ? item.discont : mainDiskont;
    console.log("discont", discont);
    let newPrise: number =
      Math.round((item.price - (item.price * discont) / 100) * 100) / 100;
    console.log("new", newPrise);
    const newItem: CartItem = {
      id: item.id,
      name: item.name,
      type: item.type,
      img: item.image,
      price: newPrise,
      quantity: 1,
      total: newPrise,
    };
    cart.push(newItem);
  } else {
    cart[indexInCart].quantity++;
    cart[indexInCart].total =
      Math.floor((cart[indexInCart].total + item.price) * 100) / 100;
  }
  printCartTotal(cauntTotal());
}
//======================================================================
function printCart() {
  const cartContent = document.createElement("div");
  cartContent.classList.add("cart-modal-content");
  let cartContainer: string;
  if (cart.length) {
    cartContainer = "";
    cart.forEach((item, index) => {
      let quantity = item.quantity;
      const quantityContainer = document.createElement("div");
      if (quantity === 1) {
        quantityContainer.innerHTML = `<button class="item-delete" data-index="${index}">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              
              <div class="item-quantity">${quantity}</div>
              <button class="item-plus" data-index="${index}">+</button>`;
      } else {
        quantityContainer.innerHTML = `
          <button class="item-minus " data-index="${index}">-</button>
          <div class="item-quantity">${quantity}</div>
          <button class="item-plus " data-index="${index}">+</button>`;
      }
      cartContainer += `<div class="cart-item">
                <img
                  class="cart-img"
                  src="media/images/cards/${item.img}"
                  alt="${item.name}"
                />
                <h4 class="item-name">${item.name}</h4>
                <div class="item-total">${item.total}$</div>
                <p class="item-type">${item.type}</p>

                <div class="item-quantity-container">
                  ${quantityContainer.innerHTML}
                </div>
              </div>`;
    });

    cartContainer += `<div class="total-price">
                <p>Totall: <span class="modal-total"> ${cauntTotal()} $</span></p>
              </div>`;
    cartContainer = `<div class="cart-container"> ${cartContainer}</div>`;
  } else {
    cartContainer = `<div class="empty"> Cart is empty </div>`;
  }
  //add content into CART
  cartContent.innerHTML = `
            <h2>Cart</h2>
           ${cartContainer}
            <div class="ictruction">
              <h3>Purchase Instructions</h3>
              <ol>
                <li>
                  <h4>Product selection</h4>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Aperiam facere corrupti eius esse quo dicta odit.
                  </p>
                </li>
                <li>
                  <h4>Payment for the product</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Omnis, neque quis. Aliquid, quidem.
                  </p>
                </li>
                <li>
                  <h4>Activation</h4>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Laudantium, natus!
                  </p>
                </li>
              </ol>
            </div>
            <div class="pay-info-container">
              <form action="" class="pay-info" id="buy-form">
                <div class="user-info">
                  <label for="nick"> Your nickname on the server</label>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="Enter your nickname"
                    required
                  />
                  <label for="mail">Enter your email</label>
                  <input
                    type="text"
                    id="mail"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                  <label for="agree" class="agree"
                    ><input type="checkbox" id="agree" required />
                    <p>
                      I accept the terms of the <span>user agreement</span> and
                      the provision of services
                    </p></label
                  >
                </div>
                <div class="pay">
                  <h3>Checkout</h3>
                  <div class="total-price">
                    <p>Total: <span class="modal-total"> ${cauntTotal()} $</span></p>
                  </div>
                  <button id="pay-now">Pay Now</button>
                  <p class="policy">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    <span>Privacy Policy</span>
                  </p>
                </div>
              </form>
            </div>`;
  const closeButon = document.createElement("button") as HTMLButtonElement;
  closeButon.classList.add("close");
  closeButon.innerHTML = "&times;";
  cartContent.appendChild(closeButon);
  cartContent.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("item-plus")) {
      const index = Number(target.dataset.index);
      cart[index].quantity++;
      cart[index].total =
        Math.floor((cart[index].total + cart[index].price) * 100) / 100;
      printCartTotal(cauntTotal());
      printCart();
    }
    if (target.classList.contains("item-minus")) {
      const index = Number(target.dataset.index);
      cart[index].quantity--;
      cart[index].total =
        Math.floor((cart[index].total - cart[index].price) * 100) / 100;
      printCartTotal(cauntTotal());
      printCart();
    }
    const deleteButton = target.closest(".item-delete") as HTMLElement;
    if (deleteButton) {
      const index = Number(deleteButton.dataset.index);
      cart.splice(index, 1);
      printCartTotal(cauntTotal());
      printCart();
    }
  });
  cartModal.innerHTML = "";
  cartModal.appendChild(cartContent);
  //=============================================================================
  //=================    BAY   STRIPE   =========================================

  const form = document.getElementById("buy-form") as HTMLFormElement;
  const stripe = Stripe(
    "pk_test_51RfGezH8oitdDHtZQRBnLCMTjCJIOFS2eD2OBg7l1F4OGmwR7lCcMcrPTKzV1EVLh06tpkouNQBejKDr74cyV2SY00O3rH3GGb"
  );
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("let pya!!!");
    const formData = new FormData(form);
    const nickname = formData.get("nickname");
    const email = formData.get("email");
    const amount = cauntTotal();

    // Sesion für backend
    const res = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, amount }),
    });
    const data = await res.json();
    cleanCart();
    if (data.sessionId) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.log(result.error.message);
        alert(result.error.message);
      } else {
        console.log("keine sessionId");
      }
    }
  });
}

//========================================================================
//=========cards print====================================================

const container = document.querySelector(".cards-container") as HTMLDivElement;

const printCards = (cards: Card[]) => {
  container.innerHTML = "";
  cards.forEach((item) => {
    const cardHtml = document.createElement("div");
    let discont = mainDiskont < item.discont ? item.discont : mainDiskont;
    let newPrise: number = item.price - (item.price * discont) / 100;

    let newPriceRound: string = newPrise.toFixed(2);
    cardHtml.classList.add("scale-in");
    if (discont) {
      cardHtml.innerHTML = `<h2>${item.name}</h2>
              <button class="card-img"><img src="media/images/cards/${item.image}" alt="${item.name}"></button>
              <div class="card-price">
                <div class="old-price">${item.price} $</div>
                <div class="new-price">${newPriceRound} $</div>
              </div>
              <button class="bay">Bay Now</button>
              <div class="card-sale">-${discont}%</div>
            </div>`;
    } else {
      cardHtml.innerHTML = `<h2>${item.name}</h2>
          <button class="card-img"><img src="media/images/cards/${item.image}" alt="${item.name}"></button>
          <div class="card-price">
            
            <div class="new-price">${item.price} $</div>
          </div>
          <button class="bay">Bay Now</button>
          
        </div>`;
    }
    cardHtml.classList.add("card");
    setTimeout(() => {
      cardHtml.classList.add("show");
    }, 100);
    container.appendChild(cardHtml);

    //=========== onClick img ===============================================
    //=======================================================================

    const img: HTMLButtonElement = cardHtml.querySelector(
      ".card-img"
    ) as HTMLButtonElement;
    // =========create DESCRIPTION=====================
    const description = document.createElement("div");
    item.description.forEach((p) => {
      const paragraf = document.createElement("p");
      paragraf.textContent = p;
      description.appendChild(paragraf);
    });
    // ================================================
    img.onclick = () => {
      const modalCard = document.getElementById("modal-card") as HTMLDivElement;
      if (discont) {
        modalCard.innerHTML = `<div class="modal-card-content">
            <button class="close">&times;</button>
            <h2>${item.name}</h2>
            <img
              src="media/images/cards/${item.image}"
              class="modal-card-img"
              alt="${item.name}"
            />
            <div class="card-modal-price">
              <div class="modal-sale">
                <p>sale</p>
                <p style="font-size: xx-large">${discont}%</p>
                <p>sale</p>
              </div>
              <div class="old-modal-price">${item.price}  $</div>
              <div class="new-modal-price">${newPriceRound} $</div>
            </div>

            <div class="description">
             ${description.innerHTML}
            </div>

            <button class="bay card-bay">Bay Now</button>
          </div>`;
      } else {
        modalCard.innerHTML = `<div class="modal-card-content">
            <button class="close">&times;</button>
            <h2>${item.name}</h2>
            <img
              src="media/images/cards/${item.image}"
              class="modal-card-img"
              alt="${item.name}"
            />
            <div class="card-modal-price">
              <div class="new-modal-price">${item.price} $</div>
            </div>

            <div class="description">
             ${description.innerHTML}
            </div>

            <button class="bay card-bay">Bay Now</button>
          </div>`;
      }
      //================== MODAL CARD VISIBL ===================================
      modalCard.classList.remove("hidden");
      const modalBackdrop = document.querySelector(
        ".backdrop"
      ) as HTMLDivElement;
      modalBackdrop.classList.remove("hidden");
      //================ Bay Modal ========================================
      const bayBtn = modalCard.querySelector(".bay") as HTMLButtonElement;
      bayBtn.onclick = () => {
        addToCart(item);
        setCart(cart);
        console.log("modal", cart);
      };

      //================== MODAL CLOSE ====================================
      const closeModalBtn = document.querySelector(
        ".close"
      ) as HTMLButtonElement;
      const closeModal = () => {
        modalBackdrop.classList.add("hidden");
        modalCard.classList.add("hidden");
      };
      closeModalBtn.addEventListener("click", closeModal);
    };

    //=======================================================================
    //======= BAY NOW =======================================================
    const bayBtn = cardHtml.querySelector(".bay") as HTMLButtonElement;
    bayBtn.onclick = () => {
      addToCart(item);
      setCart(cart);
      console.log(cart);
    };
    //=======================================================================
  });
};

//==========================================================================
//============== Cart ======================================================
let cartBnt = document.querySelector(".basket") as HTMLDivElement;
printCartTotal(cauntTotal());

//==============VISIBL======================================================

cartBnt.addEventListener("click", () => {
  printCart();
  const modalBackdrop = document.querySelector(".backdrop") as HTMLDivElement;
  modalBackdrop.classList.remove("hidden");
  cartModal.classList.remove("hidden");

  //========== CART CLOSE ===================================================
  cartModal.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("close")) {
      modalBackdrop.classList.add("hidden");
      cartModal.classList.add("hidden");
    }
  });
});
//==============================================================================
//=====Eventlistener new Page===================================================

document.addEventListener("DOMContentLoaded", () => {
  cart = getCart();
  printCartTotal(cauntTotal());
  cartBnt = document.querySelector(".basket") as HTMLDivElement;
});
//======================================================================
//======================================================================
const documentContainer = document.getElementById("shop") as HTMLDivElement;

if (documentContainer) {
  if (mainDiskont) {
    const sale = document.querySelector("#sale") as HTMLDivElement;
    sale.innerHTML = `<p>sale</p>
            <p style="font-size: xx-large">${mainDiskont}%</p>
            <p>sale</p>`;
    sale.classList.add("sale");
  }

  fetch("./cards.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item: Card) => cards.push(item));
      printCards(cards);
      const categoryList: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll(".category-btn");
      categoryList.forEach((btn) => {
        btn.onclick = () => {
          categoryList.forEach((item) => {
            item.classList.remove("active-btn");
          });
          btn.classList.add("active-btn");
          console.log("text on btn", btn.textContent);
          let category: string | null = btn.getAttribute("data-type");
          console.log("das ist category", category);
          if (category) {
            const filtrCards = cards.filter((item) => item.type === category);
            printCards(filtrCards);
          } else printCards(cards);
        };
      });
    })
    .catch((err) => console.error("Fehler beim Laden von JSON:", err));
}

//==============================================================================
//=====Eventlistener new Page===================================================

document.addEventListener("DOMContentLoaded", () => {
  cart = getCart();
  printCartTotal(cauntTotal());
  cartBnt = document.querySelector(".basket") as HTMLDivElement;
});
