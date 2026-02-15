<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Redirigiendo a Webpay...</title>
</head>
<body onload="document.getElementById('webpay-form').submit();">
    <div style="text-align: center; margin-top: 20%;">
        <h1>Redirigiendo a Webpay...</h1>
        <p>Por favor espere, no cierre esta ventana.</p>
        <form id="webpay-form" action="{{ $url }}" method="POST">
            <input type="hidden" name="token_ws" value="{{ $token }}">
            <button type="submit" style="display: none;">Ir a Webpay</button>
        </form>
    </div>
</body>
</html>
