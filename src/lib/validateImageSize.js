// Utility to validate image size (maxKB in kilobytes)
export function validateImageSize(file, maxKB = 650) {
  if (!file) return false;
  if (file.size > maxKB * 1024) {
    alert(`Image size must be under ${maxKB} KB.`);
    return false;
  }
  return true;
}
