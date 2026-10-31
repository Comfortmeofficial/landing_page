import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { paymentApi } from '@/lib/api';
import { clearGuestSession } from '@/lib/guestSession';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

type Status = 'verifying' | 'success' | 'failed';

function viewTicketHref(reference: string | null) {
  return reference ? `/book/ticket?reference=${encodeURIComponent(reference)}` : '/book/ticket';
}

// Where Paystack's hosted checkout sends the browser back to, carrying
// ?reference= (or ?trxref=, the same two keys the mobile app's
// PaystackCheckout WebView already looks for) — this is the web
// equivalent of that WebView's callback interception, just a normal
// page since there's no app shell to intercept navigation inside.
export function BookConfirmPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('verifying');
  const [error, setError] = useState<string | null>(null);

  // 'reference'/'trxref' are Paystack's redirect param names; 'tx_ref' is
  // Flutterwave's — which gateway processed this payment is an invisible,
  // admin-controlled choice, so this page needs to recognize both.
  const reference =
    searchParams.get('reference') ?? searchParams.get('trxref') ?? searchParams.get('tx_ref');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setError('No payment reference was returned.');
      return;
    }
    paymentApi
      .verify(reference)
      .then((result) => {
        // A failed/pending/abandoned payment still comes back as a normal
        // 200 here (Paystack's own status, not an HTTP error) — booking_id
        // is only ever set on the response once a real booking was created,
        // so its absence is the actual signal, not a thrown error.
        if (!result.booking_id) {
          setStatus('failed');
          setError(
            result.status && result.status !== 'success'
              ? `Payment ${result.status}. You have not been charged a booking.`
              : 'We could not confirm your payment. If you were charged, contact support.',
          );
          return;
        }
        setStatus('success');
        clearGuestSession();
      })
      .catch((err) => {
        setStatus('failed');
        setError(apiErrorMessage(err, 'We could not confirm your payment. If you were charged, contact support.'));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24 min-h-screen flex items-center">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center shadow-sm">
          {status === 'verifying' && (
            <>
              <Loader2 size={48} className="mx-auto animate-spin text-secondary-500" />
              <h1 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Confirming your payment…</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This only takes a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <h1 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">You're booked!</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Check your email for your ticket and receipt — your QR code is inside it.
              </p>
              <Button variant="primary" size="lg" fullWidth className="mt-8">
                <a href={viewTicketHref(reference)}>View my ticket</a>
              </Button>
              <Button variant="outline" size="lg" fullWidth className="mt-3">
                <a href="/">Back to home</a>
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle size={48} className="mx-auto text-red-500" />
              <h1 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{error}</p>
              <Button variant="primary" size="lg" fullWidth className="mt-8">
                <a href="/book">Try again</a>
              </Button>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
