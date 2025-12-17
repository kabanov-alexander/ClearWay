import { ICwLibPosition } from '../interfaces/position.interface';

export function calculateMousePositionAbsolute(
  event: MouseEvent | DragEvent,
  scaleX: number = 1,
  scaleY: number = 1
): ICwLibPosition {
  const doc = document.documentElement;
  const body = document.body;
  const top = event.clientY +
      (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
      (doc && doc.clientTop  || body && body.clientTop  || 0);
  const left = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0);

  return {
    top: top / scaleY,
    left: left / scaleX
  };
}

export function calculateMousePositionRelativeTo(
  event: MouseEvent | DragEvent,
  relativeTo: HTMLElement,
  scaleX: number = 1,
  scaleY: number = 1
): ICwLibPosition {
  const rect = relativeTo.getBoundingClientRect();

  return {
    top: (event.clientY - rect.top) / scaleY,
    left: (event.clientX - rect.left) / scaleX
  };
}
