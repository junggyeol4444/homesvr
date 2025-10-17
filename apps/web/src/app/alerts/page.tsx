import { PriceAlertForm } from '../../components/price-alert-form';
import { PriceDelayBanner, Card, CardContent, CardHeader, CardTitle } from '@homesvr/ui';

const AlertsPage = () => (
  <div className="space-y-10">
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold text-white">가격 알림 센터</h1>
      <p className="text-sm text-slate-400">이메일·Slack·Telegram으로 최저가 변동을 알려드립니다.</p>
    </header>
    <PriceDelayBanner message={process.env.NEXT_PUBLIC_PRICE_DISCLAIMER} />
    <PriceAlertForm />
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Opt-in / Opt-out 정책</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-300">
        <p>알림 구독 시 동의 로그를 저장하고, 언제든지 알림 해지 요청을 처리합니다.</p>
        <p>개인정보는 Google Cloud KMS/Secrets Manager로 암호화 관리됩니다.</p>
      </CardContent>
    </Card>
  </div>
);

export default AlertsPage;
