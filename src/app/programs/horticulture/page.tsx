import ProgramPage from '@/components/ProgramPage';

export default function HorticulturePage() {
    return (
        <ProgramPage
            data={{
                badge: '원예 힐링',
                title: '원예 힐링 프로그램',
                subtitle: '식물과 함께하는 정서적 치유와 마음 회복의 시간\n자연의 속도로 일상의 지친 마음을 돌봅니다.',
                heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=2000',
                categoryColor: '#9ACD32',
                overview:
                    '식물을 돌보는 행위가 인간에게 미치는 긍정적인 심리 치유 효과는 과학적으로 입증되어 있습니다. 꽃뜰의 원예 힐링 프로그램은 심리 상담사 및 원예 치료사가 설계한 커리큘럼을 통해 스트레스 완화, 집중력 향상, 정서적 안정 등의 효과를 제공합니다.',
                targets: ['스트레스 관리가 필요한 직장인', '정서 지원이 필요한 청소년', '우울감을 경험하는 성인', '노인 복지 기관', '재활이 필요한 환자', '전 연령 일반 참여자'],
                curriculum: [
                    { title: '타인과 교감하기', desc: '식물과 호흡 맞추기, 텃밭 산책, 감각 깨우기 활동으로 현재에 충실한 마음을 만듭니다.' },
                    { title: '원예 테라피 활동', desc: '꽃꽂이, 테라리움 만들기, 허브 화분 심기 등 손으로 하는 창의적 활동을 진행합니다.' },
                    { title: '성장 일기 작성 & 정리', desc: '식물과 함께 내 마음의 변화를 기록하며 감사와 성장을 인식합니다.' },
                ],
                features: [
                    { icon: '🌸', title: '전문 원예 치료사 동행', desc: '공인 원예 치료사가 함께해 심리적 지지와 치유를 제공합니다.' },
                    { icon: '🧘', title: '마음 챙김 기반 설계', desc: '마음챙김(Mindfulness) 기법을 접목한 시간이 준비되어 있습니다.' },
                    { icon: '🌱', title: '나만의 식물 분양', desc: '수업에서 심은 나만의 식물 화분을 집으로 가져가실 수 있습니다.' },
                    { icon: '📝', title: '심리 변화 기록지 제공', desc: '회차별 심리 변화와 개선 사항을 기록해 드립니다.' },
                ],
                ctaText: '원예 힐링 프로그램으로 지친 마음을 돌봐보세요',
            }}
        />
    );
}
