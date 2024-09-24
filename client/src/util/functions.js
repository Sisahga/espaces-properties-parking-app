export function notify(message, success) {
  var notificationDiv = document.getElementById("notification-ctn");
  notificationDiv.innerHTML = `<p class="notification">${message}</p>`;
  if (success) {
    notificationDiv.style.backgroundColor = "#28A745";
  } else {
    notificationDiv.style.backgroundColor = "#DC3545";
  }
  notificationDiv.style.display = "flex";

  setTimeout(() => {
    notificationDiv.style.display = "none";
  }, 3000);
}
