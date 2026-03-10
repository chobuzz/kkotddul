import ProgramPage from '@/components/ProgramPage';

export default function HealingPage() {
    return (
        <ProgramPage
            data={{
                badge: '치유 농업',
                title: '치유 농업 프로그램',
                subtitle: '기관·기업 복지, 장애인, 학교, 바우처 사업 등\n대상별 맞춤형 정서 치유와 회복을 함께합니다.',
                heroImage: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=2000',
                categoryColor: '#8EBC8E',
                overview:
                    '천연쟁이 꽃뜰의 치유 농업 프로그램은 농업 활동을 통해 신체적·정신적 건강을 회복하고 사회적 통합을 도모합니다. 씨앗 심기, 수확, 음식 만들기 등 자연과의 교감을 통해 일상의 스트레스를 해소하고 자존감을 높입니다. 국가 공인 치유 농업사가 직접 기획·운영하여 안전하고 전문적인 프로그램을 제공합니다.',
                targets: ['기업 복지 단체', '장애인 복지기관', '초·중·고등학교', '바우처 대상자', '요양 기관', '지역 공동체'],
                curriculum: [
                    { title: '오리엔테이션 & 텃밭 가꾸기', desc: '프로그램 소개 및 텃밭 관찰, 계절 식물 심기 활동으로 자연 친화적 정서를 자극합니다.' },
                    { title: '수확 체험 & 요리 활동', desc: '직접 키운 채소를 수확하고 간단한 요리를 만들어 성취감과 협동심을 기릅니다.' },
                    { title: '식물 테라피 & 반성 시간', desc: '허브 심기, 꽃꽂이, 향 체험 등을 통해 치유 효과를 극대화하고 활동 마무리를 합니다.' },
                ],
                features: [
                    { icon: '🌿', title: '국가 공인 전문가 운영', desc: '치유 농업사 자격을 갖춘 전문가가 설계·진행합니다.' },
                    { icon: '🏡', title: '450평 프라이빗 정원', desc: '외부 방해 없는 쾌적한 자연 환경에서 진행됩니다.' },
                    { icon: '📋', title: '맞춤 프로그램 설계', desc: '기관 특성과 참여자에 맞게 커리큘럼을 조정합니다.' },
                    { icon: '📊', title: '활동 결과 보고서 제공', desc: '기관 제출용 활동 사진 및 결과 보고서를 드립니다.' },
                ],
                ctaText: '치유 농업 프로그램을 예약해보세요',
            }}
        />
    );
}
