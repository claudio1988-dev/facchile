<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Comprobante de Venta #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            width: 100%;
            margin-bottom: 20px;
        }
        .logo {
            width: 150px;
        }
        .company-info {
            float: right;
            text-align: right;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-bold: bold;
            text-transform: uppercase;
            margin: 20px 0;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .details-section {
            width: 100%;
            margin-bottom: 20px;
        }
        .details-box {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            width: 300px;
            float: right;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <img src="{{ public_path('logo.png') }}" class="logo" alt="Facchile">
                </td>
                <td class="company-info">
                    <strong>FACCHILE OUTDOOR</strong><br>
                    RUT: 77.123.456-7<br>
                    Av. Siempre Viva 123, Puerto Montt<br>
                    Chile<br>
                    contacto@facchile.cl
                </td>
            </tr>
        </table>
    </div>

    <div class="title">
        Comprobante de Venta #{{ $order->order_number }}
    </div>

    <div class="details-section">
        <div class="details-box">
            <strong>CLIENTE:</strong><br>
            {{ $order->customer->first_name }} {{ $order->customer->last_name }}<br>
            RUT: {{ $order->customer->rut }}<br>
            Email: {{ $order->customer->email }}<br>
            Teléfono: {{ $order->customer->phone }}
        </div>
        <div class="details-box">
            <strong>DETALLES DEL PEDIDO:</strong><br>
            Fecha: {{ $order->created_at->format('d/m/Y H:i') }}<br>
            Estado: {{ $order->status }}<br>
            Pago: {{ $order->payment_status }}<br>
            @if($order->shippingAddress)
                Dirección: {{ $order->shippingAddress->address_line1 }}, {{ $order->shippingAddress->commune->name }}
            @endif
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th class="text-right">Cant.</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->sku }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">${{ number_format($item->unit_price, 0, ',', '.') }}</td>
                <td class="text-right">${{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table style="width: 100%;">
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-right">${{ number_format($order->subtotal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Envío:</strong></td>
                <td class="text-right">${{ number_format($order->shipping_cost, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>IVA (19%):</strong></td>
                <td class="text-right">${{ number_format($order->tax, 0, ',', '.') }}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: bold; border-top: 2px solid #000;">
                <td style="padding-top: 10px;">TOTAL:</td>
                <td class="text-right" style="padding-top: 10px;">${{ number_format($order->total, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Este documento no es una factura legal. Es un comprobante de transacción realizada en Facchile Outdoor.
    </div>
</body>
</html>
