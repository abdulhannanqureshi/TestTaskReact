import toastr from "toastr";
import { BehaviorSubject } from 'rx'

toastr.options = {
  positionClass: "toast-top-right",
  showDuration: "300",
  timeOut: 3000,
  closeButton: true,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

export const count = (totalCount, limit) => {
  let total = totalCount / limit
  let totalPage = []
  for(let i=0; total > i; i++){
      totalPage.push(i+1)
  }
  return totalPage.length
}
// for global loader service
export const isLoading = new BehaviorSubject(false)

export const isDialogOpen = new BehaviorSubject(false)

export const forSuccess = (message, title) => toastr.success(message, title);

export const forError = (message, title) => toastr.error(message, title)

export const forWarning = (message, title) => toastr.warning(message, title)