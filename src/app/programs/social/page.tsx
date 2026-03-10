import ProgramPage from '@/components/ProgramPage';

export default function SocialPage() {
    return (
        <ProgramPage
            data={{
                badge: '사회적 농업',
                title: '사회적 농업 활동',
                subtitle: '지역사회와 상생하며 농업이 지닌 진정한 가치를 나눕니다.\n함께 자라는 공동체의 텃밭을 꿈꿉니다.',
                heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000',
                categoryColor: '#6B8E23',
                overview:
                    '사회적 농업은 농업 활동을 통해 사회적 약자를 포용하고 지역 공동체를 강화하는 활동입니다. 꽃뜰은 발달 장애인, 고령자, 청년 취업 취약계층 등 다양한 사회 구성원들과 함께 농업을 통한 자립과 사회 통합을 실현하고자 합니다.',
                targets: ['발달 장애 성인', '지역 고령 농민', '취업 취약 청년', '다문화 가정', '자립 준비 청년 (보호종료 아동)', '귀농 희망자'],
                curriculum: [
                    { title: '지역 연계 텃밭 운영', desc: '지역 주민과 공동 텃밭을 조성하고 씨앗부터 수확까지 함께 관리합니다.' },
                    { title: '생산·가공·판매 연계 교육', desc: '수확물을 직접 가공하고 판로를 개척하는 사회적 경제 교육을 제공합니다.' },
                    { title: '공동체 축제 & 나눔 행사', desc: '계절마다 지역 주민과 함께하는 나눔 장터와 축제를 개최합니다.' },
                ],
                features: [
                    { icon: '🤝', title: '공동체 상생', desc: '취약 계층과 지역 농민이 함께하는 상생 모델을 추구합니다.' },
                    { icon: '🌾', title: '자립 역량 강화', desc: '농업 기술 교육 및 창업 지원으로 지속 가능한 자립을 돕습니다.' },
                    { icon: '💚', title: '사회적 가치 창출', desc: '농업 활동을 통해 지역에 긍정적인 사회·경제적 가치를 만들어냅니다.' },
                    { icon: '🏅', title: '정부 인증 사업 참여', desc: '농림축산식품부 인증 사회적 농장으로 체계적인 지원을 받습니다.' },
                ],
                ctaText: '사회적 농업 활동에 함께 참여해주세요',
            }}
        />
    );
}
