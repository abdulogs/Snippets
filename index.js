const cart = {
  items: [],
  init() {
    // const items = localStorage.getItem("items");
    // return items ? items : localStorage.setItem("items", []);
  },
  listing() {
    return this.items;
  },
  add(item) {
    const is_exists = this.items.some((item) => item.id == id);
    console.log(is_exists);
    if (!is_exists) return this.items.push(item);
  },
  read(id) {
    return this.items.filter((item) => item.id == id)[0];
  },
  update() {
    return this.items.filter((item) => item.id == id)[0];
  },
  remove(id) {
    const list = this.items.filter((item) => item.id == id)[0];
    console.log(list);
  },
};

cart.init();

function listing() {
  let template = "";
  const list = cart.listing();
  list.forEach((item) => {
    template += `<div>${item.name} x ${item.qty} <button class="delete-from-cart" data-id="${item.id}">x</button></div>`;
  });
  document.getElementById("cart-items").innerHTML = template;
}

document.querySelectorAll(".add-to-cart").forEach(function (item) {
  item.addEventListener("click", function (e) {
    const id = item.getAttribute("data-id");
    const name = item.getAttribute("data-name");
    item.classList.replace("add-to-cart", "delete-from-cart");
    item.innerText = "Remove"
    cart.add({ id: id, name: name, qty: 1 });
    listing();
  });
});

document.querySelectorAll(".delete-from-cart").forEach(function (item) {
  item.addEventListener("click", function (e) {
    const id = item.getAttribute("data-id");
    item.classList.replace("remove-from-cart", "add-to-cart");
    cart.remove(id);
    listing();
  });
});
