import unittest
from decimal import Decimal, localcontext
from quote import quote_cart


class QuoteTests(unittest.TestCase):
    def test_catalog_and_kg_conversion(self):
        for product, expected in [("A", "6000"), ("B", "8000")]:
            result = quote_cart([(product, 1000)])
            self.assertEqual(result["currency"], "CRC")
            self.assertEqual(result["total"], Decimal(expected))
            self.assertIsInstance(result["total"], Decimal)

    def test_fractional_grams_multiple_and_repeat(self):
        result = quote_cart([("A", "250.5"), ("B", Decimal("125.25")), ("A", "0.01")])
        self.assertEqual(result["total"], Decimal("2505.06"))
        self.assertEqual([x["amount"] for x in result["items"]],
                         [Decimal("1503"), Decimal("1002"), Decimal("0.06")])

    def test_unknown_product(self):
        with self.assertRaises(ValueError):
            quote_cart([("C", 100)])

    def test_nonpositive_quantities(self):
        for grams in [0, "0.0", -1, Decimal("-0.001")]:
            with self.subTest(grams=grams), self.assertRaises(ValueError):
                quote_cart([("A", grams)])

    def test_invalid_and_nonfinite(self):
        for grams in ["NaN", "sNaN", "Infinity", "oops", 0.1, True, None]:
            with self.subTest(grams=grams), self.assertRaises(ValueError):
                quote_cart([("A", grams)])

    def test_empty_and_generator(self):
        self.assertEqual(quote_cart([])["total"], Decimal("0"))
        self.assertEqual(quote_cart((item for item in [("A", "1.5"), ("B", "2.5")]))["total"], Decimal("29"))

    def test_precision_independent_of_callers_context(self):
        with localcontext() as ctx:
            ctx.prec = 3
            self.assertEqual(quote_cart([("A", "0.12345678901234567890123456789")])["total"],
                             Decimal("0.74074073407407407340740740734"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
