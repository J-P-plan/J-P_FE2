import { ComponentClass } from "react";
import { SortableContainer, SortableContainerProps } from "react-sortable-hoc";
import { PlanItemProps } from "../../../types/schedule";
import { PlanItem } from "./PlanItem";
import styled from "styled-components";

interface Props {
  planItems: PlanItemProps[];
  isEdit: boolean;
  setIsPlanDetail: () => void;
  setIsPlanPlace: () => void;
  handleDeleteOpen: () => void;
}

export const PlanList: ComponentClass<SortableContainerProps & Props> =
  SortableContainer(
    ({
      planItems,
      isEdit,
      setIsPlanDetail,
      setIsPlanPlace,
      handleDeleteOpen,
    }: Props) => {
      return (
        <>
          <PlanListContainer>
            {planItems.map((item, index) => (
              <PlanItem
                key={index}
                index={index}
                id={index}
                isEdit={isEdit}
                setIsPlanDetail={setIsPlanDetail}
                setIsPlanPlace={setIsPlanPlace}
                planItem={item}
                handleDeleteOpen={handleDeleteOpen}
              />
            ))}
          </PlanListContainer>
        </>
      );
    }
  );

const PlanListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 13px 7px;
`;
