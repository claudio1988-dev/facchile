<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\WebpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebpayController extends Controller
{
    protected $webpayService;

    public function __construct(WebpayService $webpayService)
    {
        $this->webpayService = $webpayService;
    }

    public function start(Order $order)
    {
        // Ensure only pending orders can be paid
        if ($order->status !== 'pending' && $order->payment_status !== 'pending') {
             return redirect()->route('dashboard')->with('error', 'Order is not pending payment.');
        }

        $amount = (int) $order->total;
        $buyOrder = $order->order_number;
        $sessionId = session()->getId();
        $returnUrl = route('webpay.return');

        try {
            $response = $this->webpayService->initTransaction($amount, $buyOrder, $sessionId, $returnUrl);
            
            // Log for debugging
            Log::info('Webpay Init:', ['order' => $buyOrder, 'token' => $response['token']]);

            // For Inertia, we can pass the data to a special page that handles the redirect form
            // Or return a view that auto-submits.
            return view('webpay.redirect', [
                'url' => $response['url'],
                'token' => $response['token']
            ]);

        } catch (\Exception $e) {
            Log::error('Webpay Init Error:', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Error initiating payment: ' . $e->getMessage());
        }
    }

    public function callback(Request $request)
    {
        // Webpay sends token_ws via POST (usually) or GET (if aborted sometimes)
        $token = $request->input('token_ws');

        if (!$token) {
            // Usually user aborted
            Log::warning('Webpay Callback: No token_ws received. Likely aborted.');
            return redirect()->route('catalogo')->with('error', 'Payment aborted by user.');
        }

        try {
            $response = $this->webpayService->commitTransaction($token);
            
            Log::info('Webpay Commit:', (array) $response);

            // Using direct property access or getter methods depending on SDK version
            // Assuming recent SDK: getResponseCode(), getBuyOrder(), etc.
            // Or public properties.
            // Check status: 'AUTHORIZED' or response_code === 0

            if ($response->isApproved()) {
                $orderNumber = $response->getBuyOrder();
                $order = Order::where('order_number', $orderNumber)->firstOrFail();

                // Update Order
                $order->payment_status = 'paid';
                $order->status = 'processing'; // Or confirmed
                $order->metadata = array_merge($order->metadata ?? [], [
                    'webpay_token' => $token,
                    'authorization_code' => $response->getAuthorizationCode(),
                    'card_number' => $response->getCardDetail()['card_number'] ?? '****', 
                    'transaction_date' => $response->getTransactionDate(),
                ]);
                $order->save();

                // Redirect to success
                return redirect()->route('checkout.success', ['order' => $order->order_number]);
            } else {
                // Rejected
                Log::warning('Webpay Rejected:', ['token' => $token]);
                return redirect()->route('catalog')->with('error', 'Payment rejected by bank.');
            }

        } catch (\Exception $e) {
            // Usually happens if token is invalid or already consumed (double post)
            // Or user cancelled at Webpay (TBK_TOKEN ...)
            // Inspect $request->input('TBK_TOKEN') etc. only on cancellation?
            
            if ($request->has('TBK_TOKEN')) {
                Log::info('Webpay Cancelled by User');
                return redirect()->route('catalog')->with('error', 'Payment cancelled by user.');
            }

            Log::error('Webpay Commit Error:', ['error' => $e->getMessage()]);
            return redirect()->route('catalog')->with('error', 'Error processing payment: ' . $e->getMessage());
        }
    }
}
