using MarketPlace.Application.Payments.Dtos;
using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Payments;

public interface IPaymentService
{
    /// <summary>
    /// To'lovni imitatsiya qiladi (sandbox). Haqiqiy pul o'tkazmasi bo'lmaydi.
    /// Masalan: karta raqami "0000" bilan tugasa — muvaffaqiyatsiz natija qaytariladi (test uchun).
    /// </summary>
    Task<PaymentResultDto> ProcessAsync(PaymentMethod method, decimal amount, string? cardNumber, CancellationToken ct = default);
}
