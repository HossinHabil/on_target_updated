import StepFive from "../../_components/steps/StepFive";
import StepFour from "../../_components/steps/StepFour";
import StepOne from "../../_components/steps/StepOne";
import StepThree from "../../_components/steps/StepThree";
import StepTwo from "../../_components/steps/StepTwo";
import Sidebar from "../../_components/Sidebar";

interface StepsPageProps {
  params: Promise<{ param: string }>;
}

export default async function StepsPage({ params }: StepsPageProps) {
  const pageParam = (await params).param;
  const handleStepsForm = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive />;
    }
  };
  return (
    <div className="w-full lg:h-[calc(100vh-5rem)] flex flex-col lg:flex-row overflow-y-auto">
      <Sidebar pageParam={pageParam} />
      <main className="max-w-7xl mx-auto w-full min-w-0 flex flex-col items-center lg:pl-72 py-20 px-4">
        {handleStepsForm(parseInt(pageParam))}
      </main>
    </div>
  );
}
