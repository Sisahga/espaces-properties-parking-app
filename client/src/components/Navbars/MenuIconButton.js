const MenuIconBtn = () => {
  const handleMenuButtonClick = () => {
    const menuIconBtn = document.getElementById("menu-icon-btn");
    menuIconBtn.classList.toggle("open");

    if (menuIconBtn.classList.contains("open")) {
      document.getElementById("sideNavbar").style.display = "flex";
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("sideNavbar").style.display = "none";
      document.getElementById("overlay").style.display = "none";
    }
  };

  return (
    <button id="menu-icon-btn" onClick={handleMenuButtonClick}>
      <div id="menu-btn-burger"></div>
    </button>
  );
};

export default MenuIconBtn;
