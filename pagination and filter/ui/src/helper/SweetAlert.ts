import Swal from "sweetalert2"

export const ConfirmBox = async (obj: object | any) => {
  if (!obj) {
    obj = {}
  }
  let { title, text, type, confirmButtonColor, cancelButtonColor, confirmButtonText } = obj
  return await Swal.fire({
    title: title || 'Are you sure?',
    text: text || "You want to be able to revert this!",
    icon: type || 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmButtonColor || '#3085d6',
    cancelButtonColor: cancelButtonColor || '#d33',
    confirmButtonText: confirmButtonText || 'Yes!' 
  })
}
