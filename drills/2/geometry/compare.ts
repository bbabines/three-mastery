export function comparison(container: HTMLElement, title: string) {
  const panel = document.createElement('div');
  panel.style.cssText = 'position:absolute;right:14px;top:22%;width:38%;max-width:310px;padding:12px;border-radius:8px;background:rgba(21,23,28,.9);color:#eee;font:13px system-ui;line-height:1.45;pointer-events:none';
  const heading = document.createElement('div');
  heading.textContent = title;
  heading.style.cssText = 'font-weight:700;margin-bottom:7px';
  const input = document.createElement('div');
  const yours = document.createElement('div');
  const reference = document.createElement('div');
  yours.style.color = '#8ac7ff';
  reference.style.color = '#8ee0a5';
  panel.append(heading, input, yours, reference);
  container.append(panel);
  return (caseText: string, yourText: string, referenceText: string) => {
    input.textContent = caseText;
    yours.textContent = `blue · ${yourText}`;
    reference.textContent = `green · ${referenceText}`;
  };
}
