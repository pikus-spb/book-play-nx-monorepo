export function getOuterHeight(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  const margin =
    parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}
