using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    public class OrderStatus
    {
        Pending,
        PaymentReceived,
        PaymentFailed
    }
}