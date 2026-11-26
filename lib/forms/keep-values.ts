import { startTransition, type FormEvent } from "react";

/**
 * Відправка форми, яка не очищує поля.
 *
 * <form action={…}> у React 19 після кожної відправки скидає всі поля —
 * навіть коли сервер повернув помилку. Фахівець писав довгий текст,
 * помилявся в одному полі й отримував порожню форму. Тому відправляємо
 * вручну через onSubmit: поля лишаються як були.
 *
 * Кнопка, якою відправили, додається окремо: у FormData вона сама не
 * потрапляє, а за нею відрізняють «Опублікувати» від «Чернетки».
 */
export function submitKeepingValues(dispatch: (data: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (button?.name) data.set(button.name, button.value);
    startTransition(() => dispatch(data));
  };
}
