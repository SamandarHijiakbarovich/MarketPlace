using MarketPlace.Application.Payments;
using MarketPlace.Application.Payments.Dtos;
using MarketPlace.Domain.Enums;

namespace MarketPlace.Infrastructure.Services;

public class MockPaymentService : IPaymentService
{
    public Task<PaymentResultDto> ProcessAsync(PaymentMethod method, decimal amount, string? cardNumber, CancellationToken ct = default)
    {
        // Naqd to'lov (yetkazganda) — har doim muvaffaqiyatli
        if (method == PaymentMethod.CashOnDelivery)
        {
            return Task.FromResult(new PaymentResultDto(true, "Naqd to'lov — yetkazib berilganda qabul qilinadi."));
        }

        // Karta — imitatsiya. Bo'shliqlarni olib tashlaymiz.
        var digits = (cardNumber ?? string.Empty).Replace(" ", string.Empty);

        if (digits.Length != 16)
        {
            return Task.FromResult(new PaymentResultDto(false, "Karta raqami 16 xonali bo'lishi kerak."));
        }

        // Test uchun: "4000..." bilan boshlangan karta rad etiladi
        if (digits.StartsWith("4000"))
        {
            return Task.FromResult(new PaymentResultDto(false, "To'lov rad etildi (mablag' yetarli emas)."));
        }

        return Task.FromResult(new PaymentResultDto(true, "To'lov muvaffaqiyatli amalga oshirildi."));
    }
}