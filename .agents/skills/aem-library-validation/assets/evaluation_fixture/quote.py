"""Local CRC quote fixture; amounts remain unrounded Decimal values."""
from decimal import Decimal, InvalidOperation, localcontext
from typing import Iterable

CATALOG = {"A": Decimal("6000"), "B": Decimal("8000")}


def quote_cart(items: Iterable[tuple[str, Decimal | str | int]]) -> dict:
    """Quote (product, grams) pairs. Use strings/Decimal for fractional grams.

    Empty carts total zero. Floats/bools and non-finite quantities are rejected.
    No tax, delivery fee or currency rounding is applied by this fixture.
    """
    lines = []
    total = Decimal("0")
    for product, raw_grams in items:
        if product not in CATALOG:
            raise ValueError(f"Unknown product: {product!r}")
        if isinstance(raw_grams, bool) or not isinstance(raw_grams, (Decimal, str, int)):
            raise ValueError("Grams must be Decimal, string or integer")
        try:
            grams = Decimal(raw_grams)
        except (InvalidOperation, ValueError) as exc:
            raise ValueError("Invalid grams") from exc
        if not grams.is_finite() or grams <= 0:
            raise ValueError("Grams must be finite and positive")
        # Prices correspond exactly to 6 and 8 CRC per gram. Increase context
        # precision to retain all provided quantity digits and accumulated sums.
        with localcontext() as ctx:
            ctx.prec = max(28, len(grams.as_tuple().digits) + 5,
                           len(total.as_tuple().digits) + 5,
                           total.adjusted() - grams.as_tuple().exponent + 10,
                           grams.adjusted() - total.as_tuple().exponent + 10)
            amount = grams * (CATALOG[product] / Decimal("1000"))
            total += amount
        lines.append({"product": product, "grams": grams,
                      "price_per_kg": CATALOG[product], "amount": amount})
    return {"currency": "CRC", "items": lines, "total": total}
