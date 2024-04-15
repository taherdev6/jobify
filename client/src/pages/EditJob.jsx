import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useQuery } from "@tanstack/react-query";

const editJobQuery = (id) => {
  return {
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`);
      return data;
    },
  };
};
export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;
    try {
      await queryClient.ensureQueryData(editJobQuery(id));

      return id;
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return redirect("/dashboard/all-jobs");
    }
  };
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/jobs/${id}`, values);
      queryClient.invalidateQueries(["jobs"]);

      toast.success("Job edited");
      return redirect("/dashboard/all-jobs");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const EditJob = () => {
  const id = useLoaderData();
  const { data } = useQuery(editJobQuery(id));
  const { job } = data;

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Edit Job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            name="jobLocation"
            defaultValue={job.jobLocation}
            labelText="job location"
          />
          <FormRowSelect
            type="text"
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            type="text"
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
